jQuery( document ).ready( function( $ ){
    actualizarSociedad();
    agregarLocalSotrage();
    agregarLocalStorageJefe();
    permisosAplicacionesSAP();
	// $('.APR_TRAVEL').hide();
	// $('.ADMIN_TRAVEL').hide();
	// $('.TRAVEL').hide();

    function actualizarSociedad(){
        $.ajax({
            url:        'ws/parametros/actualizar/sociedadusuario',
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data)
        {
            if( data.result )   
            {
                 localStorage.setItem('EMPID',data.records.EMPID);   
            }
        })
         .fail(function(err)
        {
            console.log( err );
        })  
        .always( function() {
        }); 
    }

    function agregarLocalSotrage()
    {
        $.ajax({
            url:        'ws/vsociedadusuario?user='+localStorage.USUARIO,
            type:       'GET',
            dataType:   'json',
        }).done(function(data){
            if( data.result ){
                 localStorage.setItem('SOCIEDAD',data.records.SOCIEDAD);   
                 localStorage.setItem('CECO',data.records.CECO);   
                 localStorage.setItem('PAIS',data.records.PAIS);   
                 localStorage.setItem('UEN',data.records.UEN);  
                 localStorage.setItem('NOMBRE_USUARIO',data.records.NOMBRE);
                 //localStorage.setItem('evaluacion_proveedores_SAP',data.records.evaluacion_proveedores_SAP); 
            }
        }).fail(function(err){
            console.log( err );
        }); 
    }

    function agregarLocalStorageJefe()
    {
    	$.ajax({
            url:        'ws/concursos/perfil?user='+localStorage.USUARIO,
            type:       'GET',
            dataType:   'json',
        }).done(function(data){
            if( data.result ){
            	localStorage.DATOS_JEFE = JSON.stringify(data.records.jefe);
				localStorage.setItem('JEFE',data.records.jefe.ENAME); 
				localStorage.setItem('JEFE_PERN',data.records.jefe.PERNR); 
				localStorage.setItem('JEFE_EMAIL',data.records.jefe.EMAIL); 
				localStorage.setItem('JEFE_DEPTO',data.records.jefe.DEPTO); 

				$.ajax({
					url:        'ws/vsociedadusuario?user='+localStorage.JEFE_EMAIL,
					type:       'GET',
					dataType:   'json',
				}).done(function(data){
					if( data.result ){
						localStorage.setItem('JEFE_SOCIEDAD',data.records.SOCIEDAD);   
						localStorage.setItem('JEFE_CECO',data.records.CECO);   
						localStorage.setItem('JEFE_PAIS',data.records.PAIS);   
						localStorage.setItem('JEFE_UEN',data.records.UEN);  
		            }
		        }).fail(function(err){
		            console.log( err );
		        });
            }
        }).fail(function(err){ console.log( err ); }); 
    }

    function permisosAplicacionesSAP(){
    	$.ajax({
	        url:        'ws/lista/aplicaciones?user='+localStorage.USUARIO,
	        type:       'GET',
	        dataType:   'json',
	    }).done(function(data){ 
	        if( data.result ){
	            var APPSAP      =[];
	            var GAC_ADMIN   = 0;
	            var APR_TRAVEL  = 0;
	            var TRAVEL      = 0;
	            var RH_TRAVEL   = 0;
	            var KILOMETRAJE = 0;
	            var contar = parseInt(data.records.length)-1;
	            localStorage.setItem("APPSAP", JSON.stringify(data.records));

	            jQuery.each( data.records, function( index,item ){
                    // else
                    // {
                    // 	console.log("no ver arobaciones");
                    // 	$('.APR_TRAVEL').hide();
                    // }

                    if(item.SUBAPP=='RH_TRAVEL')
	                    RH_TRAVEL=1;  
	                if(item.SUBAPP=='GAC_ADMIN')
	                    GAC_ADMIN=1;

	                // if(item.SUBAPP=='APR_TRAVEL'){
	                //     $('.APR_TRAVEL').show();   
	                // }

	                // if(item.SUBAPP=='TRAVEL'){
	                //     $('.TRAVEL').show();
	                // }
					if ( item.SUBAPP == 'KILOMETRAJE') {
						$('.KILOMETRAJE').show();
					}else {
	                	$('.KILOMETRAJE').hide();
					}
	                            
	                
	                // if (item.SUBAPP == 'APROBACION_TRAVEL_DEL' && item.CANTIDAD == 1) {
                 //    		$('.APR_TRAVEL').show();
                 //    }
                 //    if (item.SUBAPP == 'ADMINISTRACION_TRAVEL_DEL' && item.CANTIDAD == 1) {
                 //    		$('.ADMIN_TRAVEL').show();
                 //    }
                 //    if (item.SUBAPP == 'SOLICITUD_TRAVEL_DEL' && item.CANTIDAD == 1) {
                 //    		$('.TRAVEL').show();
                 //    }

	                if(contar == index){
	                    //--------------------------------------------------->G.A.C. Permisos de Autorización
	                    if( GAC_ADMIN==0 )
	                        $('.GAC_ADMIN').hide();
	                    else
	                        $('.GAC_ADMIN').show();

	                    //--------------------------------------------------->Travel Permisos de Autorización
	                    // if( APR_TRAVEL > 0 || TRAVEL > 0 || RH_TRAVEL > 0 ){
	                    //     $('.TRAVEL').show();
	                    //     if( APR_TRAVEL > 0 )    $('.APR_TRAVEL').show();
	                    //     else                    $('.APR_TRAVEL').hide();

	                    //     // if( RH_TRAVEL > 0 )     $('.RH_TRAVEL').show();
	                    //     // else                    $('.RH_TRAVEL').hide();                     
	                    // }
	                   
	                    // else{
	                    //     $('.TRAVEL').hide();
	                    //     $.ajax({
	                    //         url:        'ws/travel/liquidaciones/permisos?email='+localStorage.USUARIO,
	                    //         type:       'GET',
	                    //         dataType:   'json',
	                    //     }).done(function(data){ 
	                    //     	if(data.records.length>0){
	                    //     		var aprobacion=0;
	                    //     		jQuery.each( data.records, function( indexp,permisos ){
	                    //     			if(permisos.aprobacion == 'true'){
	                    //     				permisos=1;
	                    //     				$('.AD_TRAVELV').show();
	                    //     				$('.AD_TRAVELO').hide();
	                    //     			}
	                        				
	                    //     		});
	                    //     	}
		                   //      else
		                   //          console.log('no hay delegados');
	                    //     }).fail(function(err){
	                    //         console.log('error de permisos');
	                    //         console.log(err);
	                    //     });
	                    // }

	                }
	                    
	            });
	        }
	    }).fail(function(err){
	        console.log('Error al consultar el listado de aplicaciones');
	        console.log(err);
	    });
    }



    permisosTravel();
    function permisosTravel(){
    	$.ajax({
	        type: "GET",
	        url : "ws/travel/usuario/consultar?user="+localStorage.USUARIO.toUpperCase(),
	        success : function( result )
        	{
				if( result.result )
				{
		           if (result.records.solicitud == "true") {
		           		$('.TRAVEL').show();	
		           } else {
		           		$('.TRAVEL').hide();
		           }

		           if (result.records.aprobacion == "true") {
		           		$('.APR_TRAVEL').show();
		           } else {
		           		$('.APR_TRAVEL').hide();
		           }


		           if (result.records.administrador == "true") {
		           		// $('.TRAVEL').show();
		           		$('.APR_TRAVEL').show();
		           } else {
		           		// $('.TRAVEL').hide();
		           		$('.APR_TRAVEL').hide();
		           }

		           if (result.records.sap == "true") {
		           		$('.TRAVEL_SAP').show();
		           } else {
		           		$('.TRAVEL_SAP').hide();
		           }
		     

          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
    }
	    
})