from flask import request
from redash.models import db, Organization
from redash.handlers.base import BaseResource,routes
from redash.permissions import require_admin
import json,datetime,re
from datetime import date




###增加此类主要是针对datetime.datetime日期时间和日期类型转换格式
class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)


##自定义api接口
class CustomApi(BaseResource): 

    #自定义查询接口
    @routes.route('/api/select', methods=['POST', 'GET'])
    def select(**kwargs):
        text = request.args.get('sql')
        if text:
            sql = text
            record = re.match('^select', sql)
            if record:
                try:
                    conn = db.engine.raw_connection()
                    cursor = conn.cursor()
                    cursor.execute('%s' % sql)
                    searchrecord = cursor.fetchall()
                    if searchrecord:
                        data = searchrecord
                        data=json.dumps({'data':data},cls=DateEncoder)
                        data=json.loads(data)['data']
                        data = [tuple(m) for m in data]
                    table_name=''
                    res = re.findall(r'select.*from', sql)
                    print('res', res)
                    result = re.findall(r'from.*', sql)
                    record = result[0]
                    if 'where' in record:
                        record2 = re.findall(r'from(.+?)where', record)
                        if record2:
                            table_name = record2[0].strip()
                    elif 'limit' in record:
                        record3 = re.findall(r'from(.+?)limit', record)
                        if record3:
                            table_name = record3[0].strip()
                    else:
                        record = re.findall(r'from(.*)', record)
                        if record:
                            table_name = record[0].strip()
                    print('table_name', table_name)
                    data_record = {}
                    all_data = []
                    data_list = []
                    # 查找表部分字段的值返回所有字段和值,例如：（select id,name from table）
                    if table_name and '*' not in res[0]:
                        print('no')
                        record = re.findall(r'select(.*)from', sql)
                        record = record[0].strip()
                        field_name_list = record.split(',')
                        fields_len = len(field_name_list)
                        for r in data:
                            r = list(r)
                            data = dict(zip(field_name_list, r))
                            all_data.append(data)
                        data = all_data
                    # 查找表所有字段的值返回所有字段和值（select * from table）
                    if table_name and '*' in res[0]:
                        print('yes')
                        sql = '''select column_name from information_schema.columns
                                                        where table_schema='public' and table_name='%s' ''' % table_name
                        cursor.execute(sql)
                        record = cursor.fetchall()
                        if record:
                            field_name_list = []
                            fields_len = len(record)
                            for i in record:
                                field_name = i[0]
                                field_name_list.append(field_name)
                            data_list=[]
                            for i in data:
                                i=list(i)
                                data=dict(zip(field_name_list, i))
                                data_list.append(data)
                            data=data_list
                    cursor.close()
                    conn.close()
                except Exception as e:
                    e=str(e)
                    return json.dumps({'status': 404, 'message': '查询的语句不正确，请检查！错误提示：%s' % e}, ensure_ascii=False)
        return json.dumps({'status': 200, 'message': 'success', 'data': data}, ensure_ascii=False,cls=DateEncoder)


    #自定义更新接口
    @routes.route('/api/update', methods=['POST', 'GET'])
    def update(**kwargs):
        text = request.values.get('sql')
        print('update',text)
        if text:
            sql = text
            record = re.match('^update', sql)
            if record:
                try:
                    conn = db.engine.raw_connection()
                    cursor = conn.cursor()
                    cursor.execute('%s' % sql)
                    conn.commit()
                    cursor.close()
                    return json.dumps({'status': 200, 'message': '更新语句成功!'}, ensure_ascii=False)
                except Exception as e:
                    e = str(e)
                    return json.dumps({'status': 404, 'message': '更新语句不正确，请检查！错误提示：%s' % e}, ensure_ascii=False)


    @routes.route('/api/visualizations/<visualization_id>/refresh', methods=['POST', 'GET'])
    def refresh_visualizations_widget(visualization_id):
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        sql="select id from visualizations where id='%s' " %visualization_id
        cursor.execute('%s' % sql)
        record=cursor.fetchone()
        if record:
            pass
            cursor.close()
            conn.close()
            return json.dumps({'status': 200, 'message': '更新成功!'}, ensure_ascii=False)
        else:
            cursor.close()
            conn.close()
            return json.dumps({'status': 404, 'message': '未找到更新ID,请知悉!'}, ensure_ascii=False)
