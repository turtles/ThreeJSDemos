
THREE.PanoramaControls = function ( camera, domElement ) {
    
    let scope = this;
    
	this.camera = camera;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
    
    this.isUserInteracting = false;
    
    this.onMouseDownMouseX = 0;
    this.onMouseDownMouseY = 0;
    this.lon = 0;
    this.onMouseDownLon = 0;
    this.lat = 0; 
    this.onMouseDownLat = 0;
    this.phi = 0;
    this.theta = 0;
    this.distance = 50;
    this.onPointerDownPointerX = 0;
    this.onPointerDownPointerY = 0;
    this.onPointerDownLon = 0;
    this.onPointerDownLat = 0;

    function onDocumentMouseDown ( event ) {
        event.preventDefault();
        scope.isUserInteracting = true;
        scope.onPointerDownPointerX = event.clientX;
        scope.onPointerDownPointerY = event.clientY;
        scope.onPointerDownLon = scope.lon;
        scope.onPointerDownLat = scope.lat;
        scope.update();
    }
    function onDocumentMouseMove ( event ) {
        if ( scope.isUserInteracting === true ) {
            scope.lon = ( scope.onPointerDownPointerX - event.clientX ) * 0.1 + scope.onPointerDownLon;
            scope.lat = ( event.clientY - scope.onPointerDownPointerY ) * 0.1 + scope.onPointerDownLat;
            scope.update();
        }
    }
    function onDocumentMouseUp ( event ) {
        scope.isUserInteracting = false;
        scope.update();
    }
    function onDocumentMouseWheel ( event ) {
        scope.distance += event.deltaY * 0.05;
        scope.distance = THREE.Math.clamp( scope.distance, 1, 50 );
        scope.update();
    }

    this.dispose = function () {
        
        scope.domElement.removeEventListener( 'mousedown', onDocumentMouseDown, false );
        scope.domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        scope.domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        scope.domElement.removeEventListener( 'wheel', onDocumentMouseWheel, false );
    }

    this.update = function () {
        scope.lat = Math.max( - 85, Math.min( 85, scope.lat ) );
        scope.phi = THREE.Math.degToRad( 90 - scope.lat );
        scope.theta = THREE.Math.degToRad( scope.lon );
        camera.position.x = scope.distance * Math.sin( scope.phi ) * Math.cos( scope.theta );
        camera.position.y = scope.distance * Math.cos( scope.phi );
        camera.position.z = scope.distance * Math.sin( scope.phi ) * Math.sin( scope.theta );
        camera.lookAt( camera.target );
    }

    scope.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    scope.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    scope.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
    scope.domElement.addEventListener( 'wheel', onDocumentMouseWheel, false );

	// force an update at start
	this.update();
}

THREE.PanoramaControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.PanoramaControls.prototype.constructor = THREE.PanoramaControls;
