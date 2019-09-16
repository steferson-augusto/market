'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//========================= Auth/Reset =========================
Route.post('/sessions', 'SessionController.create')
Route.post('/sessions/admin', 'SessionController.createAdmin')
Route.get('register/confirm/:token', 'UserController.confirmEmail')
Route.post('password/email', 'PasswordResetController.sendResetLinkEmail')
// Route.get('password/reset/:token', 'PasswordResetController.showResetForm')
Route.post('password/reset/:token', 'PasswordResetController.reset')
Route.post('/auth/:provider', 'UserController.socialAuth')
// Route.get('/authenticated/google', 'UserController.handleProviderCallback')

//========================= Users =========================
Route.post('/users', 'UserController.store')
Route.put('/users/:id', 'UserController.update').middleware('auth')
Route.get('/users/:id', 'UserController.show').middleware('auth')

//========================= Admin - Marks =========================
Route.get('/admin/marks', 'adminControllers/MarkController.index').middleware(['auth', 'admin'])
Route.post('/admin/marks', 'adminControllers/MarkController.store').middleware(['auth', 'admin'])
Route.put('/admin/marks/:id', 'adminControllers/MarkController.update').middleware(['auth', 'admin'])

//==================== View - Confirmação de email ====================
Route.get('register/confirm', ({ view }) => {
    return view.render('layouts.confirmed_email')
})

//================== View - Confirmação de email null ==================
Route.get('confirm/null', ({ view }) => {
    return view.render('layouts.confirmed_null')
})
