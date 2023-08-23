import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, { cloneElement, useMemo, useState } from 'react';
import * as _ from 'lodash';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { RootState } from '@react-helpers';

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const ALayout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [sideKey, setSideKey] = useState('');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const params = useParams();
  const queries = useLocation();
  const parsed = queryString.parse(queries.search);
  const reduxStates = useSelector((state: RootState) => state);

  const handleSetSideKey = (keys: string) => {
    setSideKey(keys);
  };

  useMemo(() => {
    setSideKey(queries['pathname']);
  }, [queries]);

  const uris = {
    missions: [
      { label: 'List', link: '/missions' },
      { label: 'Images', link: '/missions/images' },
      { label: 'Videos', link: '/missions/videos' },
    ],
  };

  const items: MenuItem[] = [
    getItem('Homepage', '/', <PieChartOutlined />, undefined),
    getItem(
      'Missions',
      'missions',
      <UserOutlined />,
      uris.missions.map((uri: { label: string; link: string }) =>
        getItem(<Link to={uri.link}>{uri.label}</Link>, uri.link),
      ),
    ),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={false}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultOpenKeys={['missions']}
          selectedKeys={[sideKey]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {queries.pathname
              .split('/')
              .map((path: string, index: number) =>
                index ? (
                  <Breadcrumb.Item key={path}>
                    {queries.pathname.split('/')[index]?.toUpperCase()}
                  </Breadcrumb.Item>
                ) : null,
              )}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {cloneElement(children, {
              params,
              queries: parsed,
              handleSetSideKey,
              reduxStates,
              navigate
            })}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export const withAuthLayout = (elem: React.ReactElement) => {
  return <ALayout>{elem}</ALayout>;
};
