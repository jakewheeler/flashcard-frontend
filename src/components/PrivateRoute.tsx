import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import useStore from '../stores/user';

export function PrivateRoute({ component, path, exact }: RouteProps) {
  let user = useStore((state) => state.user);

  return user ? (
    <Route component={component} path={path} exact={exact} />
  ) : (
    <Redirect to='/login' />
  );
}
