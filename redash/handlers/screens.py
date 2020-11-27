from flask_login import login_required
from flask import jsonify, request, url_for
from flask_restful import abort
from sqlalchemy.orm import backref, contains_eager, joinedload, subqueryload, load_only
from sqlalchemy.orm.exc import StaleDataError
from redash.handlers.base import (
    BaseResource,
    filter_by_tags,
    get_object_or_404,
    org_scoped_rule,
    paginate,
    routes,
    order_results as _order_results,
)
from redash import models, settings
from redash.permissions import (
    require_permission,
    require_admin_or_owner,
    is_admin_or_owner,
    require_permission_or_owner,
    require_admin,
)


class ScreenListResource(BaseResource):
    @login_required
    def get(self):
        page = request.args.get("page", 1, type=int)
        page_size = request.args.get("page_size", 50, type=int)
        pagination = models.Screen.query.options(
                joinedload(models.Screen.user).load_only(
                    "id", "name", "_profile_image_url", "email"
                )
            ).order_by(models.Screen.id.desc()).paginate(page, per_page=page_size, error_out = False)

        # screens = models.Screen.query.all()
        screens = pagination.items
        screens_data = [screen.to_dict() for screen in screens]
        return {"data": screens_data, "pages": pagination.pages, "total": models.Screen.query.count()}

    @login_required
    def post(self):
        screen_data = request.get_json(force=True)
        screen_data['org'] = self.current_org
        print('请求数据', screen_data)
        screen = models.Screen(**screen_data)
        models.db.session.add(screen)
        models.db.session.commit()
        return screen.to_dict()


class ScreenResource(BaseResource):
    @login_required
    def get(self, screen_id):
        screen =  get_object_or_404(
            models.Screen.get_by_id_and_org, screen_id, self.current_org
        )
        return screen.to_dict()

    @login_required
    def post(self, screen_id):
        screen = get_object_or_404(
            models.Screen.get_by_id_and_org, screen_id, self.current_org
        )
        screen_data = request.get_json(force=True)
        print('请求数据', screen_data)
        try:
            self.update_model(screen, screen_data)
            models.db.session.commit()
        except StaleDataError:
            abort(409)
        return {"status": 200, "msg": "数据大屏更新成功"}
