import React from 'react';
import {
  Redirect,
  Route as ReactDomRoute,
  RouteProps as ReactDomRouteProps,
} from 'react-router-dom';

import { useAuth } from '../../../context/AuthContext';

interface RouteProps extends ReactDomRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}


const Route: React.FC<RouteProps> = ({isPrivate = false, component: Component, ...rest }) => {
  const { name } = useAuth();

  return (
    <ReactDomRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!name ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/clientRedirect',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
