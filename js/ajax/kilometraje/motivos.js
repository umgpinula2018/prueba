jQuery(document).ready(function($){
	var id_registro = 0;
    var id_registro_eliminar = 0;
	window.tabla_registros = $("#tabla-registros").DataTable(
    {
        "oLanguage": {
            "sLengthMenu": "Mostrando _MENU_ filas",
            "sSearch": "",
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    llenarTabla();
    $('#btn-crear').on('click', crearRegistro);
    $('#btn-modificar').on('click', actualizarRegistro);
    $('#btn-eliminar').on('click', eliminarRegistro);

    function limpia(){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();
        $('#input_c').removeClass('valid');
        $('#input_m').removeClass('valid');
        $('#input_c').removeClass('error');
        $('#input_m').removeClass('error');
    }
    $('#btn-nuevo').on('click',function(){
       limpia();
    });
    function llenarTabla(){
    	window.tabla_registros.clear().draw();
    	$('#loader').show();
        limpia();
    	$.ajax({
    		url: 		'ws/kilometraje/motivos',
    		type: 		'GET',
    		dataType: 	'json'
    	})
    	.done(function(response){
    		if (response.result) {
    			cont = 0; acciones = '';
				$.each(response.records, function(index, value) {
					
            		acciones =  '<td>'+
									'<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'" title="Actualizar motivo"><i class="fa fa-pencil"></i></a>'+
                                    '<a class="btn btn-danger btn-xs btn-eliminar" style="margin:3px;" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'" title="Eliminar motivo"><i class="fa fa-trash"></i></a>'+
								'</td>';

					col1 = ++cont;
                    col2 = value.descripcion;
					col3 = acciones;
					window.tabla_registros.row.add([col1,col2,col3]).draw(false);
				});
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
                url:        'ws/kilometraje/motivos',
                type:       'POST',
                dataType:   'json',
                data:       $('#form-crear').serialize()
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
        id_registro = $(this).data('idregistro');
        limpia();
        $.ajax({
            url:        'ws/kilometraje/motivos/'+id_registro,
            type:       'GET',
            dataType:   'json'
        })
        .done(function(response){
            if (response.result) {
                $('#form-editar #input_m').val(response.records.descripcion);
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){})
    });

    function actualizarRegistro(){
        if ($('#form-editar').valid()) {
            $.ajax({
                url:        'ws/kilometraje/motivos/'+id_registro,
                type:       'PUT',
                dataType:   'json',
                data:       $('#form-editar').serialize()
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
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); })
        }
    }

    $('#tabla-registros').on('click', 'a.btn-eliminar', function(){
        id_registro_eliminar = $(this).data('idregistro');
    });

    function eliminarRegistro(){
        $.ajax({
            url:        'ws/kilometraje/motivos/'+id_registro_eliminar,
            type:       'DELETE',
            dataType:   'json',
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

	$("#form-editar").validate({
		rules:{
			kilometraje:{
				required: true,
                success: "valid",
			}
		},
		messages:{
			kilometraje:{
				required: 'Este campo es obligatorio'
			}
		}
	});
});