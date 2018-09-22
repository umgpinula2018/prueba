jQuery(document).ready(function($){
	var id_registro = 0;
	var id_registro_eliminar = 0;
	window.tabla_registros = $("#tabla-registros").DataTable(
    {
       "language": 
        {
            "url": "/lang/esp.lang"
        },
        // processing: true,
        // serverSide: true,
        // ajax: '/ws/activos/marcas',
        // columns: [
        //     {data: 'DT_Row_Index', name: 'DT_Row_Index',},
        //     {data: 'nombre', name: 'nombre'},
        //     {data: 'acciones', name: 'acciones'},
        // ],
        // order:[[ 1, "ASC" ]]
    });
    // $('#tabla_registros').DataTable().columns.adjust().draw();
	function limpiar(){
		$('#nombre').removeAttr('value');
	}
	
	function restaurar(){
		$("#form-crear").validate().resetForm();
		$("#form-editar").validate().resetForm();
		$('#nombre').removeClass('valid');
		$('#nombre').removeClass('error');
		$('#form-editar #nombre').removeClass('valid');
		$('#form-editar #nombre').removeClass('error');
	}
    llenarTabla();  
    $('#btn-crear').on('click', crearRegistro);
    $('#btn-actualizar').on('click', actualizarRegistro);
    $('#btn-eliminar').on('click', eliminarRegistro);
	$('#btn-nuevo').on('click',function(){
        $('#nombre').val('');
       restaurar();
    });

    function llenarTabla(){
    	window.tabla_registros.clear().draw();
    	$('#loader').show();
    	$.ajax({
    		url: 		'ws/activos/sociedades',
    		type: 		'GET',
    		dataType: 	'json'
    	})
    	.done(function(response){
    		if (response) {
    			cont = 0; acciones = '';
				$.each(response.records, function(index, value) {
					
            		acciones =  '<td>'+
									'<a class="btn btn-primary btn-xs btn-editar" title="Editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
									'<a class="btn btn-danger btn-xs btn-eliminar" title="Eliminar" style="margin:3px;" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash"></i></a>'+
								'</td>';

					col1 = ++cont;
					col2 = value.nombre;
					col3 = acciones;
					window.tabla_registros.row.add([col1,col2,col3]).draw(false);
				});
                 // window.tabla_registros.columns.adjust().draw();
    		} else {
    			toastr['error'](response.message, 'Error');
    		}
    	})
    	.fail(function(response){
    		toastr['error'](response.message, 'Error');
    	})
    	.always(function(){ $('#loader').fadeOut(); })
    }

    function crearRegistro(){
    	if ($('#form-crear').valid()) {
    		$('#loader').show();
	    	$.ajax({
	    		url: 		'ws/activos/sociedades',
	    		type: 		'POST',
	    		dataType: 	'json',
	    		data: 		$('#form-crear').serialize()
	    	})
	    	.done(function(response){
	    		if (response.result) {
	    			toastr['success'](response.message, 'Éxito');
	            	$("#modal-crear").modal('hide'); 
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
    }

    $('#tabla-registros').on('click', 'a.btn-editar', function(){
		restaurar();
    	id_registro = $(this).data('idregistro');
    	$.ajax({
    		url: 		'ws/activos/sociedades/'+id_registro,
    		type: 		'GET',
    		dataType: 	'json',
    	})
    	.done(function(response){
    		if (response.result) {
    			$('#form-editar #nombre').val(response.records.nombre);
    		} else {
    			toastr['error'](response.message, 'Error');
    		}
    	})
    	.fail(function(response){
    		toastr['error'](response.message, 'Error');
    	})
    	.always(function(){ $('#loader').fadeOut(); })
    });

    function actualizarRegistro(){
    	if ($('#form-editar').valid()) {
	    	$.ajax({
	    		url: 		'ws/activos/sociedades/'+id_registro,
	    		type: 		'PUT',
	    		dataType: 	'json',
	    		data: 		$('#form-editar').serialize()
	    	})
	    	.done(function(response){
	    		if (response.result) {
	    			toastr['success'](response.message, 'Éxito');
	            	$("#modal-editar").modal('hide'); 
	            	llenarTabla();
	    		} else {
	    			toastr['error'](response.message, 'Error');
	    		}
	    	})
	    	.fail(function(response){
	    		toastr['error'](response.message, 'Error ya existe una sociedad con el mismo nombre');
				$("#modal-editar").modal('hide'); 
	    	})
	    	.always(function(){ $('#loader').fadeOut(); })
	    }
    }
    
    $('#tabla-registros').on('click', 'a.btn-eliminar', function(){
    	id_registro_eliminar = $(this).data('idregistro');
    });

    function eliminarRegistro(){
    	$.ajax({
    		url: 		'ws/activos/sociedades/'+id_registro_eliminar,
    		type: 		'DELETE',
    		dataType: 	'json',
    	})
    	.done(function(response){
    		if (response.result) {
    			toastr['success'](response.message, 'Éxito');
            	$("#modal-eliminar").modal('hide'); 
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

    $("#form-crear").validate({
		rules:{
			nombre:{
				required: true,
			}
		},
		messages:{
			nombre:{
				required: 'Este campo es obligatorio'
			}
		}
	});

	$("#form-editar").validate({
		rules:{
			nombre:{
				required: true,
			}
		},
		messages:{
			nombre:{
				required: 'Este campo es obligatorio'
			}
		}
	});
});