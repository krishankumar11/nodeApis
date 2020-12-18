module.exports = function(io) {
    io.sockets.on("connection", function(socket){
    	  // Broadcasts a message
        socket.on('authenticate', async (query, callback) => {
            //query parameters : userId - userId of connected user
            authenticateEvent = query.hasOwnProperty('access_token')
			if (authenticateEvent == true) {
				/*query.socketId = socket.id
                let returnData = await socketServices.authenticate(query)
                callback(returnData);*/

            } else {
                callback({
                    code: 201,
                    status: false,
                    message: 'Invalid Json.'
                });
            }
        })

        socket.on('welcome_screen_emitter', async (query, callback) => {
            //io.emit('welcome_screen', {}); s
            io.sockets.emit('welcome_screen', {});
        })
        socket.on('gallery_permission_screen_emitter', async (query, callback) => {
            //io.emit('gallery_permission_screen', {}); 
            io.sockets.emit('gallery_permission_screen', {});
        })
        socket.on('camera_permission_screen_emitter', async (query, callback) => {
            //io.emit('camera_permission_screen', {}); 
            io.sockets.emit('camera_permission_screen', {});
        })
        socket.on('complete_setup_category_emitter', async (query, callback) => {
            //io.emit('complete_setup_category', {}); 
            io.sockets.emit('complete_setup_category', {});
        })
        socket.on('storage_permission_screen_emitter', async (query, callback) => {
            //io.emit('storage_permission_screen', {}); 
            io.sockets.emit('storage_permission_screen', {});
        })
        socket.on('push_notification_screen_emitter', async (query, callback) => {
            //io.emit('push_notification_screen', {}); 
            io.sockets.emit('push_notification_screen', {});
        })
        socket.on('app_drawer_permission_emitter', async (query, callback) => {
            //io.emit('app_drawer_permission', {}); 
            io.sockets.emit('app_drawer_permission', {});
        })
        socket.on('get_ladder_screen_emitter', async (query, callback) => {
            //io.emit('get_ladder_screen', {}); 
            io.sockets.emit('get_ladder_screen', {});
        })
        socket.on('selected_category_questions_emitter', async (query, callback) => {
            //io.emit('selected_category_questions', {}); 
            io.sockets.emit('selected_category_questions', {});
        })
        socket.on('complete_setup_questions_emitter', async (query, callback) => {
            //io.emit('complete_setup_questions', {}); 
            io.sockets.emit('complete_setup_questions', {});
        })
        socket.on('tutorial_screen_emitter', async (query, callback) => {
            //io.emit('tutorial_screen', {'data':'tutorial_screenIOEMIT'}); 
            io.sockets.emit('tutorial_screen', {'data':'tutorial_screen'});
        })
        socket.on('get_quick_setup_emitter', async (query, callback) => {
            //io.emit('get_quick_setup', {}); 
            io.sockets.emit('get_quick_setup', {});
        })
        socket.on('choose_set_up_emitter', async (query, callback) => {
            //io.emit('choose_set_up', {}); 
            io.sockets.emit('choose_set_up', {});
        })
        socket.on('signup_signin_selection_emitter', async (query, callback) => {
            //io.emit('signup_signin_selection', {}); 
            io.sockets.emit('signup_signin_selection', {});
        })
    });
};