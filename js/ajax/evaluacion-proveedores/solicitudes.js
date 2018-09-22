jQuery(document).ready(function($){
	var id_registro = 0;
	var id_registro_eliminar = 0;
    var ocultar = JSON.parse(localStorage.usuario).evaluacion_proveedores_SAP;
    if(ocultar == 0)
    {
    // document.getElementById('btn-actualizar').style.display = 'none';
    $('#btn-actualizar').hide();
    }
    
	window.tabla_registros = $("#tabla-registros").DataTable({
        "language": 
        {
            "url": "/lang/esp.lang"
        },

        processing: true,
        serverSide: true,
        searching: true,
        ajax: 'ws/evaluacion/proveedores/lista/pendientes',
        columns: [
            {data: 'DT_Row_Index', name: 'DT_Row_Index',},
            {data: 'no_solped', name: 'no_solped'},
            {data: 'texto_breve', name: 'texto_breve'},
            {data: 'solicitante', name: 'solicitante'},
            {data: 'proveedor', name: 'proveedor'},
            {data: 'nombre_proveedor', name: 'nombre_proveedor'},
            {data: 'correo_proveedor', name: 'correo_proveedor'},
            {data: 'valor_moneda', name: 'valor_moneda'},
            {data: 'estado_nombre', name: 'estado_nombre'},
        ],
         'columnDefs': [
            { 'searchable': false, 'targets': [8] }
          ]
    });


    // $('#tabla_registros').DataTable().columns.adjust().draw();
	 var contador=1;
     var contador_editar = 1;
     var ponderacion_final = 0;
    // llenarTabla();  
    $('#btn-actualizar').on('click', actualizarSolicitudes);
     $('#form-editar #btn-añadir').on('click',function(e){  
        e.preventDefault();
        $('#form-editar #formulario').append('<div class="form-group form-encuesta" id="formulario'+contador_editar+'">'+
                            '<div class="col-md-5">'+
                                '<label>Criterio:</label>'+
                                '<input type="text" class="form-control" id="nombre'+contador_editar+'" name="nombre" required>'+
                            '</div>'+
                            '<div class="col-md-5">'+
                                '<label>Ponderación: </label>'+
                                '<input type="number" class="form-control" id="ponderacion'+contador_editar+'" name="ponderacion" required>'+
                            '</div>'+
                            '<div class="col-md-2">'+
                                '<a class="btn btn-danger btn-md btn-eliminar-fila" title="Eliminar fila" data-idregistro="'+contador_editar+'" style="margin-top:25px;"><i class="fa fa-trash"></i></a>'+
                            '</div>'+
                        '</div>');
        contador_editar = contador_editar+1;
         $('.form-encuesta .btn-eliminar-fila').on('click',function(e){
            e.preventDefault();
            var id = $(this).data('idregistro');
            $('#form-editar #formulario'+id+'').remove();
        });
    });
    $('#form-crear #btn-añadir').on('click',function(e){
        e.preventDefault();
        $('#form-crear #formulario').append('<div class="form-group form-encuesta" id="formulario'+contador+'">'+
                            '<div class="col-md-5">'+
                                '<label>Criterio:</label>'+
                                '<input type="text" class="form-control" id="nombre'+contador+'" name="nombre" required>'+
                            '</div>'+
                            '<div class="col-md-5">'+
                                '<label>Ponderación: </label>'+
                                '<input type="number" class="form-control" id="ponderacion'+contador+'" name="ponderacion" required>'+
                            '</div>'+
                            '<div class="col-md-2">'+
                                '<a class="btn btn-danger btn-md btn-eliminar-fila" title="Eliminar fila" data-idregistro="'+contador+'" style="margin-top:25px;"><i class="fa fa-trash"></i></a>'+
                            '</div>'+
                        '</div>');
        contador = contador+1;
        $('#form-crear .btn-eliminar-fila').on('click',function(e){
            e.preventDefault();
            var id = $(this).data('idregistro');
            $('#formulario'+id+'').remove();
        });
       
    });
    
     $('#btn-registrar').on('click',Enviar);
     $('#btn-actualizar-encuesta').on('click',Actualizar);
     $('#btn-modificar').on('click',llenarDatos);
    function llenarDatos(){
         contador_editar+1;
        $('#form-editar #nombre').val('');
        $('#form-editar #ponderacion').val('');
        $('#form-editar .form-encuesta').remove();
        $.ajax({
            url:        'ws/evaluacion/proveedores/encuesta/lista/datos',
            type:       'GET',
            dataType:   'json',
        })
        .done(function(response){
            if (response.result) {
                if (response.records.encuesta) {
                    objeto = JSON.parse(response.records.encuesta);
                    if (objeto.length == 1 ) {
                        $('#formulario #nombre').val(objeto[0].nombre);
                        $('#formulario #ponderacion').val(objeto[0].ponderacion);
                    } else if (objeto.length > 1){
                        $.each(objeto, function(index, value) {
                            if (index==0) {
                                 $('#form-editar #nombre').val(objeto[index].nombre);
                                 $('#form-editar #ponderacion').val(objeto[index].ponderacion);
                            } else if(index > 0) {
                                    $('#form-editar #formulario').append('<div class="form-group form-encuesta" id="formulario'+contador_editar+'">'+
                                        '<div class="col-md-5">'+
                                            '<label>Criterio:</label>'+
                                            '<input type="text" class="form-control" id="nombre'+contador_editar+'" name="nombre" required>'+
                                        '</div>'+
                                        '<div class="col-md-5">'+
                                            '<label>Ponderación: </label>'+
                                            '<input type="number" class="form-control" id="ponderacion'+contador_editar+'" name="ponderacion" required>'+
                                        '</div>'+
                                        '<div class="col-md-2">'+
                                            '<a class="btn btn-danger btn-md btn-eliminar-fila" title="Eliminar fila" data-idregistro="'+contador_editar+'" style="margin-top:25px;"><i class="fa fa-trash"></i></a>'+
                                        '</div>'+
                                    '</div>');
                                    $('#form-editar #nombre'+contador_editar+'').val(objeto[index].nombre);
                                    $('#form-editar #ponderacion'+contador_editar+'').val(objeto[index].ponderacion);
                                    contador_editar= contador_editar+1;
                                     $('.form-encuesta .btn-eliminar-fila').on('click',function(e){
                                        e.preventDefault();
                                        var id = $(this).data('idregistro');
                                        $('#form-editar #formulario'+id+'').remove();
                                    });
                            }        
                        });
                    }
                } 
            } else {
                toastr['error'](response.message, 'Error');
            }                                         
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }

    function Enviar(){
        ponderacion_final = 0;
		var array = [];
		var object = {
		   			nombre: $('#formulario #nombre').val(),
		   			ponderacion: $('#formulario #ponderacion').val(),
                    calificacion: ''
		   		}	
   				array.push(object);
    	for (var i = 1; i < contador; i++) {
    		if ($('#formulario'+i+'').hasClass('form-encuesta')) {
    			var object = {
		   			nombre: $('#formulario'+i+' #nombre'+i).val(),
		   			ponderacion: $('#formulario'+i+' #ponderacion'+i).val(),
                    calificacion: ''
		   		}	
   				array.push(object);
    		} 
    	}
        validacion = 1;
        validacion_texto = 1;
        $.each(array , function(index, value) {
            if (parseInt(value.ponderacion)==0) {
                validacion = 0;
            }
        });
         $.each(array , function(index, value) {
            if (value.ponderacion=='') {
                validacion = 0;
            }
        });
        $.each(array , function(index, value) {
            if (value.nombre == '') {
                validacion_texto = 0;
            } 
        });
        if (validacion_texto == 0) {
            toastr['warning']('Los criterios de la evaluación no puede ir vacíos', 'Cuidado');
        } else {
            if (validacion == 0) {
                toastr['warning']('Las ponderaciones deben tener un valor mayor a 0', 'Cuidado');
            } else {
                $.each(array , function(index, value) {
                    ponderacion_final = ponderacion_final + parseInt(value.ponderacion);
                });
                if (ponderacion_final == 100) {
                	$.ajax({
                		url: 		'ws/evaluacion/proveedores/encuesta',
                		type: 		'POST',
                		dataType: 	'json',
                        data:       {id: id_registro,encuesta:JSON.stringify(array)}
                	})
                	.done(function(response){
                		if (response.result) {
                            toastr['success'](response.message, 'Éxito');
                            $('#modal-encuesta').modal('hide');
                        	llenarTabla();
                		} else {
                			toastr['error'](response.message, 'Error');
                		}
                	})
                	.fail(function(response){
                		toastr['error'](response.message, 'Error');
                	})
                	.always(function(){ $('#loader').fadeOut(); })
                } else {
                    toastr['warning']('Las ponderaciones no equivalen al 100% por favor verifique', 'Cuidado');
                }
             }
        }
    }

    function Actualizar(){
        ponderacion_final = 0;
        var array = [];
        var object = {
                    nombre: $('#form-editar #nombre').val(),
                    ponderacion: $('#form-editar #ponderacion').val(),
                    calificacion: ''
                }   
                array.push(object);
        for (var i = 1; i < contador_editar; i++) {
            if ($('#form-editar #formulario'+i+'').hasClass('form-encuesta')) {
                var object = {
                    nombre: $('#form-editar #formulario'+i+' #nombre'+i).val(),
                    ponderacion: $('#form-editar #formulario'+i+' #ponderacion'+i).val(),
                    calificacion: ''
                }   
                array.push(object);
            } 
        }
        validacion = 1;
        validacion_texto = 1;
        $.each(array , function(index, value) {
            if (parseInt(value.ponderacion)==0) {
                validacion = 0;
            }
        });
        $.each(array , function(index, value) {
            if (value.ponderacion=='') {
                validacion = 0;
            }
        });
        $.each(array , function(index, value) {
            if (value.nombre == '') {
                validacion_texto = 0;
            } 
        });
        if (validacion_texto==0) {
        	toastr['warning']('Los criterios de la evaluación no puede ir vacíos', 'Cuidado');
        } else {
	        if (validacion == 0) {
	        	toastr['warning']('Las ponderaciones deben tener un valor mayor a 0', 'Cuidado');
	        } else {
		        $.each(array , function(index, value) {
		            ponderacion_final = ponderacion_final + parseInt(value.ponderacion);
		        });
		        if (ponderacion_final ==100) {
                    $('#loader').fadeIn();
		            $.ajax({
		                url:        'ws/evaluacion/proveedores/encuesta/general',
		                type:       'POST',
		                dataType:   'json',
		                data:       {encuesta:JSON.stringify(array)}
		            })
		            .done(function(response){
		                if (response.result) {
                            $('#loader').fadeOut();
		                    toastr['success']('Se actualizo la evaluación correctamente', 'Éxito');
		                    $('#modal-encuesta-modificar').modal('hide');
		                    llenarTabla();
		                } else {
		                    toastr['error'](response.message, 'Error');
		                }
		            })
		            .fail(function(response){
		                toastr['error'](response.message, 'Error');
		            })
		            .always(function(){ $('#loader').fadeOut(); })
		         } else {
		            toastr['warning']('Las ponderaciones no equivalen al 100% por favor verifique', 'Cuidado');
		        }
	        }
	     }
    }

    function llenarTabla(){
        window.tabla_registros.destroy();
        window.tabla_registros = $("#tabla-registros").DataTable({
        "language": 
        {
            "url": "/lang/esp.lang"
        },
            
        processing: true,
        serverSide: true,
        searching: true,
        ajax: 'ws/evaluacion/proveedores/lista/pendientes',
        columns: [
            {data: 'DT_Row_Index', name: 'DT_Row_Index',},
            {data: 'no_solped', name: 'no_solped'},
            {data: 'texto_breve', name: 'texto_breve'},
            {data: 'solicitante', name: 'solicitante'},
            {data: 'proveedor', name: 'proveedor'},
            {data: 'nombre_proveedor', name: 'nombre_proveedor'},
            {data: 'correo_proveedor', name: 'correo_proveedor'},
            {data: 'valor_moneda', name: 'valor_moneda'},
            {data: 'estado_nombre', name: 'estado_nombre'},
        ],
         'columnDefs': [
            { 'searchable': false, 'targets': [8] }
          ]
    });
    }
    $('#loader').hide();
    $('#tabla-registros').on('click', 'a.btn-encuesta', function() {
        id_registro = $(this).data('idregistro');
        $('#form-crear #formulario #nombre').val('');
        $('#form-crear #formulario #ponderacion').val('');
        for (var i = 1; i < contador; i++) {
            $('#form-crear #formulario'+i).remove();
            $('#form-crear #formulario'+i).remove();
        }
        contador=1;
    });

    $('#tabla-registros').on('click', 'a.btn-encuesta-modificar',function(){
        id_registro = $(this).data('idregistro');
        llenarDatos();
        contador_editar=1;
    });


    function actualizarSolicitudes(){
        user = $('#email-user').text();
        $('#loader').show();
    	$.ajax({
    		url: 		'ws/evaluacion/proveedores/actualizar/pendientes',
    		type: 		'POST',
    		dataType: 	'json',
            // data:       {encargado:user.substr(0,user.indexOf('@'))}
            // data:       {encargado:'UIDCR00526'}
    	})
    	.done(function(response){
    		if (response.result) {
            	llenarTabla();
    		} else {
    			toastr['error'](response.message, 'Error');
    		}
    	})
    	.fail(function(response){
    		toastr['error'](response.message, 'Error');
    	})
    	.always(function(){ $('#loader').fadeOut(); })
    }
});