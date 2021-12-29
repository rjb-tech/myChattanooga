requirejs.config({
    baseUrl: '/static/news/js',
    paths: {
        'smoothState': 'jquery.smoothState.min',
        'plugins_easing': 'plugins.easing',
	'functions': 'functions'
    }
});

requirejs(['ss_config']);
