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


    llenarTabla();
    
    $('#btn-aprobar').on('click', aprobar);
    $('#btn-rechazar').on('click', rechazo);
    $('#tabla-registros').on('click','a.btn-rechazar', limpia);

    function limpia(){
        $('#form-rechazar')[0].reset();
        $("#form-rechazar").validate().resetForm();
        $('#comentario_rechazo').removeClass('valid');
        $('#comentario_rechazo').removeClass('error');
    }

    function llenarTabla(){

        limpia();
        $('#loader').show();
    	window.tabla_registros.clear().draw();
        
    	$.ajax({
    		url: 		'ws/kilometraje/aprobacion',
    		type: 		'GET',
    		dataType: 	'json'
    	})
    	.done(function(response){
    		if (response.result) {
                cont = 0; acciones = '' 
                var type='';
				$.each(response.records, function(index, value) {

				    acciones =  '<td>'+
									'<a class="btn btn-success btn-xs btn-aprobar" href="#modal-aprobar" data-toggle="modal" data-idregistro="'+value.id+'" title="Aprobacion de kilometraje"><i class="fa fa-check"></i></a>'+
                                    '<a class="btn btn-danger btn-xs btn-rechazar" href="#modal-rechazar" data-toggle="modal"  data-idregistro="'+value.id+'" title="Rechazo de kilometraje" style="margin-left:5px"><i class="fa fa-close"></i></a>'+
                                '</td>';
                    switch (value.tipo) {
                        case 1:
                            type = '<center><span class="label label-warning">Vehículo: Terios</span></center>';
                            break;
                        case 2:
                            type = '<center><span class="label label-warning">Vehículo: Tiida</span></center>';
                            break;
                        case 3:
                            type = '<center><span class="label label-warning">Zona: Rural</span></center>';
                            break;
                        case 4:
                            type = '<center><span class="label label-warning">Zona: Urbana</span></center>';
                            break;
                        default:
                            type = '<center><span class="label label-warning">Sin tipo</span></center>';
                            break;
                    }
					col1 = ++cont;
                    col2 = value.ruta;
                    col3 = value.pernr_agente;
                    col4 = value.agente;
                    col5 = type;
                    col6 = value.km_teorico+' km';
                    col7 = value.km_real+' km';
                    col8 = value.fecha;
                    col9 = value.motivo.descripcion;
                    col10 = value.justificacion;
					col11 = acciones;
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11]).draw(false);
				});
    		} else {
    			toastr['warning'](response.message, 'Sin solicitudes');
    		}
    	})
    	.fail(function(response){
    		toastr['error'](response.message, 'Error');
    	})
    	.always(function(){ $('#loader').fadeOut(); })
    }

    $('#tabla-registros').on('click', 'a.btn-aprobar', function(){        
        id_registro = $(this).data('idregistro');

        $.ajax({
            url:        'ws/kilometraje/aprobacion/'+id_registro,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    $('#form-aprobar #id').val(response.records.id);
                    $('#form-aprobar #km_aprobado').val(response.records.km_real);
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){
                $('#loader').fadeOut();
            })
    });

    $('#tabla-registros').on('click', 'a.btn-rechazar', function(){        
        id_registro = $(this).data('idregistro');
        $('#km_id').val(id_registro);
    });

    function aprobar(){
        $('#loader').show();
        $.ajax({
                url:        'ws/kilometraje/aprobacion',
                type:       'POST',
                dataType:   'json',
                data:       $('#form-aprobar').serialize()
            })
            .done(function(response){
                if (response.result) {
                    toastr['success'](response.message, 'Éxito');
                    $("#modal-aprobar").modal('hide'); 
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

    function rechazo(){

        if ($('#form-rechazar').valid()) {
            $('#loader').show();
            $.ajax({
                url:        'ws/kilometraje/aprobacion',
                type:       'POST',
                dataType:   'json',
                data:       $('#form-rechazar').serialize()
            })
            .done(function(response){
                if (response.result) {
                    toastr['success'](response.message, 'Éxito');
                    $("#modal-rechazar").modal('hide'); 
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
});