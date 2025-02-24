/* eslint-disable no-nested-ternary */
import React from 'react';
import { Redirect, Route as ReactDomRoute, RouteProps as ReactDomRouteProps, useLocation, useRouteMatch } from 'react-router-dom';

import { useAuth } from 'context/AuthContext';

interface RouteProps extends ReactDomRouteProps {isPrivate?: boolean; component: React.ComponentType }

const Route: React.FC<RouteProps> = ({isPrivate = false, component: Component, ...rest}) => {

  const location = useLocation();
  const { name } = useAuth();
  const path = location.pathname;

  // Routes to avoid validation user token
  // This pages can be called directlly by URL without validation user
  const matchRoute = useRouteMatch('/newUser');
  const firstAccessRoute = useRouteMatch('/newFirstAccess');
  const publicPage = useRouteMatch('/coverages');
  const subscriberPage = useRouteMatch('/subscriber');
  const financialInformationPage = useRouteMatch('/financialInformation');

  return (
    <>
      {matchRoute || firstAccessRoute || publicPage || subscriberPage || financialInformationPage ? (
        <ReactDomRoute
          {...rest}
          path="/newUser"
          render={() => {
            return <Component />;
          }}
        />
      ) : (
        <ReactDomRoute
          {...rest}
          render={({ location }) => {
            return isPrivate === !!name ? (
              <Component />
            ) : (
              <Redirect
                to={{
                  pathname: isPrivate ? '/' : '/clientRedirect', // dashboard
                  state: { from: location },
                }}
              />
            );
          }}
        />
      )}
    </>
  );
};

export default Route;
