<?php 

//Homepage route
$app->slim->get('/', array($app->controllers['pages'], 'index'))->name('index');

//Backend routes
$app->slim->get('/dashboard', array($app->controllers['dashboard'], 'index'))->name('dashboard-index');
$app->slim->get('/dashboard/menus', array($app->controllers['dashboard'], 'menus'))->name('dashboard-menus');

$app->slim->map('/dashboard/pages', array($app->controllers['dashboard'], 'pages'))->via('GET', 'POST')->name('dashboard-pages');
$app->slim->get('/dashboard/page/:id', array($app->controllers['dashboard'], 'single_page'))->name('dashboard-single-page');
$app->slim->get('/dashboard/new-page', array($app->controllers['dashboard'], 'new_page'))->name('dashboard-new-page');
$app->slim->get('/dashboard/delete-page/:id', array($app->controllers['dashboard'], 'delete_page'))->name('dashboard-delete-page');
$app->slim->post('/dashboard/save-page', array($app->controllers['dashboard'], 'save_page'))->name('dashboard-save-page');

$app->slim->get('/dashboard/products', array($app->controllers['dashboard'], 'products'))->name('dashboard-products');
$app->slim->get('/dashboard/product/:id', array($app->controllers['dashboard'], 'single_product'))->name('dashboard-single-product');
$app->slim->get('/dashboard/orders', array($app->controllers['dashboard'], 'orders'))->name('dashboard-orders');
$app->slim->get('/dashboard/order/:id', array($app->controllers['dashboard'], 'single_order'))->name('dashboard-single-order');
$app->slim->get('/dashboard/posts', array($app->controllers['dashboard'], 'posts'))->name('dashboard-posts');
$app->slim->get('/dashboard/post/:id', array($app->controllers['dashboard'], 'single_post'))->name('dashboard-single-post');
$app->slim->get('/dashboard/options', array($app->controllers['dashboard'], 'options'))->name('dashboard-options');
$app->slim->post('/dashboard/upload', array($app->controllers['dashboard'], 'upload'))->name('dashboard-upload');

//Auth routes
$app->slim->map('/login', array($app->controllers['auth'], 'login'))->via('GET', 'POST')->name('login');
$app->slim->get('/logout', array($app->controllers['auth'], 'logout'))->name('logout');

//Frontend routes
$app->slim->get('/products/:permalink', function ($permalink) use ($app) {
	echo 'Product: ' . $permalink; 
});

$app->slim->get('/products', function () use ($app) {
	echo 'Products'; 
});

$app->slim->get('/blog/:year/:month/:permalink', function ($year, $month, $permalink) use ($app) {
	echo 'Blog post on: ' . $year . ', ' . $month . ', ' . $permalink;
});

$app->slim->get('/blog', function () use ($app) {
	echo 'Blog';
});

$app->slim->get('/:permalink', array($app->controllers['pages'], 'single'))->name('single-page');

?>