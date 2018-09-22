jQuery(document).ready(function($){
	
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

    var id_registro = 0;
    var date        = new Date();
    var ultimoDia   = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var mes         = ultimoDia.getDate();

    llenarTabla();
    
    $('#btn-modificar').on('click', actualizarRegistro);

    function limpia(){
        $('#form-editar')[0].reset();
        $("#form-editar").validate().resetForm();
        $('#nombre').removeClass('valid');
        $('#nombre').removeClass('error');
        $('#variable').removeClass('valid');
        $('#variable').removeClass('error');
        $('#fijo').removeClass('valid');
        $('#fijo').removeClass('error');

        $('#form-editar #total').prop( "disabled", false );
        $('#form-editar #variable').prop( "disabled", false );
        $('#form-editar #fijo').prop( "disabled", false );
    }

    function llenarTabla(){

        limpia();
        $('#loader').show();
    	window.tabla_registros.clear().draw();
        
    	$.ajax({
    		url: 		'ws/kilometraje/configuracion',
    		type: 		'GET',
    		dataType: 	'json'
    	})
    	.done(function(response){
    		if (response.result) {
    			cont = 0; acciones = '';
				$.each(response.records, function(index, value) {
					
            		acciones =  '<td>'+
									'<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
                                '</td>';
                    var total = '';
                    switch (value.id) {
                        case 1:
                            total = value.total+' km';
                            break;
                        case 2:
                            total = value.total*100+' %';
                            break;
                        default:
                            total = value.total+' ₡';
                    }
					col1 = ++cont;
					col2 = value.nombre;
                    col3 = value.variable != 0.00 ? value.variable +' ₡': '---';
                    col4 = value.fijo != 0.00 ? value.fijo +' ₡': '---';
                    col5 = total;
					col6 = acciones;
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6]).draw(false);
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

    $('#tabla-registros').on('click', 'a.btn-editar', function(){        
        id_registro = $(this).data('idregistro');
        limpia();
        $.ajax({
            url:        'ws/kilometraje/configuracion/'+id_registro,
            type:       'GET',
            dataType:   'json'
        })
        .done(function(response){
            if (response.result) {
                $('#form-editar #nombre').val(response.records.nombre);
                switch (response.records.id) {
                    case 1:
                        $('#form-editar #variable').prop( "disabled", true );
                        $('#form-editar #fijo').prop( "disabled", true );
                        $('#form-editar #total').val(response.records.total);
                        break;
                    case 2:
                        $('#form-editar #variable').prop( "disabled", true );
                        $('#form-editar #fijo').prop( "disabled", true );
                        $('#form-editar #total').val(response.records.total*100);
                        break;
                    default:
                        $('#form-editar #total').prop( "disabled", true );
                        $('#form-editar #variable').prop( "disabled", false );
                        $('#form-editar #fijo').prop( "disabled", false );
                        $('#form-editar #variable').val(response.records.variable);
                        $('#form-editar #fijo').val(response.records.fijo);
                        $('#form-editar #total').val(response.records.total);
                        break;
                }
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
        porcentaje    = $('#porcentaje').val()/100;
        km_autorizado = $('#km_autorizado').val();
        pago_km       = $('#pago_km').val();

        if ($('#form-editar').valid()) {
            $.ajax({
                url:        'ws/kilometraje/configuracion/'+id_registro,
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
                console.log('fail');
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); })
        }
    }

    $('#form-editar #variable').change(function (e) {
        var variable = parseFloat($('#form-editar #variable').val());
        var fijo = parseFloat($('#form-editar #fijo').val());
        var total =  variable + fijo;
        $('#form-editar #total').val(total)
    });

    $('#form-editar #fijo').change(function (e) {
        var variable = parseFloat($('#form-editar #variable').val());
        var fijo = parseFloat($('#form-editar #fijo').val());
        var total =  variable + fijo;
        $('#form-editar #total').val(total)
    });


	$("#form-editar").validate({
		rules:{
			kilometraje:{
				required: true,
			}
		},
		messages:{
			kilometraje:{
				required: 'Este campo es obligatorio'
			}
		}
	});

});