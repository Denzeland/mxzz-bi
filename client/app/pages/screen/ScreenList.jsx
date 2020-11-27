import { clientConfig, currentUser } from "@/services/auth";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { divide } from "numeral";
import { axios } from "@/services/axios";
import { Table } from 'antd';
import { extend, map } from "lodash";

function ScreenList(props) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [screenTotal, setScreenTotal] = useState(0);
    const arryReducer = (prevState, updatedProperty) => {
        if (updatedProperty.length > 0) {
            return [...updatedProperty];
        } else {
            return [];
        }
    };
    const [screenTableData, setScreenTableData] = useReducer(arryReducer, []);
    const columns = [
        {
            title: "数据大屏名称",
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, record) => {
                return <a href={`/screen/${record.id}`}>{text}</a>
            }
        },
        {
            title: "数据大屏描述",
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "数据大屏创建人",
            dataIndex: 'user',
            key: 'user',
            render: (user, record) => {
                return <span>{user.name}</span>
            }
        }
    ];
    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    }
    const onPageChange = (page, pageSize) => {
        console.log('页码改变', page, pageSize);
    }

    useEffect(() => {
        axios.get(`/api/screens`, { page, pageSize }).then(screens => {
            console.log('大屏列表数据', screens);
            const dataSource = map(screens.data, screen => {
                return extend(screen, {key: screen.id});
            })
            setScreenTableData(dataSource);
            setScreenTotal(screens.total);
        }).catch(error => {
            console.log('大屏列表出错', error);
        });
    }, [page, pageSize]);

    return (<Table columns={columns} dataSource={screenTableData} size="middle"
        pagination={{
            defaultCurrent: 1,
            defaultPageSize: 50,
            current: page,
            hideOnSinglePage: true,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100'],
            onShowSizeChange,
            onChange: onPageChange,
            total: screenTotal
        }}
    />)
}

export default routeWithUserSession({
    path: "/screens",
    title: '大屏列表',
    render: pageProps => <ScreenList {...pageProps} />,
})