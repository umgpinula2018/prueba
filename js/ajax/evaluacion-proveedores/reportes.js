jQuery(document).ready(function($){
	var id_registro = 0;
	var id_registro_eliminar = 0;
	var id_registro_eliminar = 0;
    $('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
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
    // window.tabla_registros = $("#tabla-registros").DataTable({
    //     "language": 
    //     {
    //         "url": "/lang/esp.lang"
    //     },
            
    //     processing: true,
    //     serverSide: true,
    //     searching: true,
    //     ajax: 'ws/evaluacion/proveedores/lista/historial',
    //     columns: [
    //         {data: 'DT_Row_Index', name: 'DT_Row_Index',},
    //         {data: 'no_solped', name: 'no_solped'},
    //         {data: 'texto_breve', name: 'texto_breve'},
    //         {data: 'solicitante', name: 'solicitante'},
    //         {data: 'proveedor', name: 'proveedor'},
    //         {data: 'nombre_proveedor', name: 'nombre_proveedor'},
    //         {data: 'correo_proveedor', name: 'correo_proveedor'},
    //         {data: 'valor_moneda', name: 'valor_moneda'},
    //         {data: 'resultado_evaluacion', name: 'resultado_evaluacion'},
    //     ],
    //      'columnDefs': [
    //         { 'searchable': false, 'targets': [8] }
    //       ]
    // });

    $('#exportar').on('click',function(e)
    {
        e.preventDefault();
        var fechainicio     = $('#fecha_inicio').datepicker('getDate');
        var fechafin        = $('#fecha_fin').datepicker('getDate');
            window.location.href = 'ws/evaluacion/proveedores/exportar?fecha_inicio='+fechainicio+'&fecha_fin='+fechafin;
            toastr["success"]("Generando archivo", "Por favor espere");
    });

    $("#consultar").on( "click", function( e )
        {
            e.preventDefault();
            var fechainicio     = $('#fecha_inicio').datepicker('getDate');
            var fechafin        = $('#fecha_fin').datepicker('getDate');
            if( fechafin >= fechainicio )
            {
                $.ajax(
                {
                    type:   'GET',
                    url:    'ws/reportes/evaluacion/proveedores',
                    data:   { finicio:$('#fecha_inicio').val(), ffin:$('#fecha_fin').val() },
                    success: function( result )
                        {
                            // console.log( result );
                            if( result.result )
                            { 
                                $("#tabla-registros").dataTable().fnClearTable();
                                var cont = 0;
                                if( result.records.length > 0 )
                                {
                                    $.each(result.records, function( index , value )
                                    {   
                                        $('#tabla-registros').dataTable().fnAddData([
                                            index,
                                            value.no_solped,
                                            value.texto_breve,
                                            value.solicitante,
                                            value.proveedor,
                                            value.nombre_proveedor,
                                            value.correo_proveedor, 
                                            '₡. '+value.valor_total,
                                            value.resultado_evaluacion
                                        ]);
                                    });
                                    toastr['success'](result.message, 'Éxito');
                                }
                                else
                                    toastr['warning'](result.message, 'Información');
                            }
                            else
                            {
                                $("#tabla-detalle").dataTable().fnClearTable();
                                toastr['error'](result.message, 'Error');
                            }
                        },
                    error: function( result )
                        {
                            toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                        }
                });
            }
            else
                toastr['error']('Fechas invalidas, por favor revise', 'Error');
        });
    });