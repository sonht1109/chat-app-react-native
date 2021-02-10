import React from 'react'
import AuthProvider from './src/navigations/AuthProvider';
import Route from './src/navigations/Route';

export default function App() {

  return (
    <AuthProvider>
      <Route />
    </AuthProvider>
  )
}