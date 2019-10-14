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

Route.get('/app', 'SessionController.app')

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
Route.get('/users', 'UserController.index')
Route.get('/admin/users/:id', 'UserController.setAdmin')

//========================= Admin - Marks =========================
Route.post('/admin/marks/filter', 'adminControllers/MarkController.index').middleware(['auth', 'admin'])
Route.post('/admin/marks', 'adminControllers/MarkController.store').middleware(['auth', 'admin'])
Route.put('/admin/marks/:id', 'adminControllers/MarkController.update').middleware(['auth', 'admin'])

//========================= Admin - Sections =========================
Route.post('/admin/sections/filter', 'adminControllers/SectionController.index')
Route.post('/admin/sections', 'adminControllers/SectionController.store')
Route.put('/admin/sections/:id', 'adminControllers/SectionController.update')

//========================= Admin - Ums =========================
Route.post('/admin/ums/filter', 'adminControllers/UmController.index').middleware(['auth', 'admin'])
Route.post('/admin/ums', 'adminControllers/UmController.store').middleware(['auth', 'admin'])
Route.put('/admin/ums/:id', 'adminControllers/UmController.update').middleware(['auth', 'admin'])

//========================= Admin - Products =========================
Route.post('/admin/products/filter', 'adminControllers/ProductController.index').middleware(['auth', 'admin'])
Route.post('/admin/products', 'adminControllers/ProductController.store').middleware(['auth', 'admin'])
Route.put('/admin/products/:id', 'adminControllers/ProductController.update').middleware(['auth', 'admin'])

//============================== Products ==================================
Route.get('products', 'ProductController.index').middleware('auth')
Route.post('products/:id/image', 'ImageController.store').middleware('auth')
Route.get('products/:id/image', 'ImageController.show')
Route.get('sections', 'SectionController.index').middleware('auth')
Route.get('sections/:id', 'SectionController.show').middleware('auth')

//==================== View - Confirmação de email ====================
Route.get('register/confirm', ({ view }) => {
    return view.render('layouts.confirmed_email')
})

//================== View - Confirmação de email null ==================
Route.get('confirm/null', ({ view }) => {
    return view.render('layouts.confirmed_null')
})
