jQuery( document ).ready( function( $ ){

    $("#loader").fadeOut();
    $('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        endDate: 'today'
    });


    window.tablaAreas = $("#tabla-registros").DataTable(
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

    
    $('#exportar').on('click',function(e)
    {
        e.preventDefault();
        var fechainicio     = $('#fecha_inicio').val();
        var fechafin        = $('#fecha_fin').val();
        if((fechafin)&&(fechainicio))
        {
            if( fechafin > fechainicio || fechainicio == fechafin)
            {
                window.location.href = "ws/documentos/exportar?fechaini="+fechainicio+"&fechafin="+fechafin;
                toastr["success"]("Exportado correctamente", "Éxito");
            }
            else
            {
                toastr['warning']('Las fechas son invalidas revise por favor');
            }
        }
        else
        {
            toastr['warning']('Las fechas estan vacias');
        }
        
    });

    $('#consultar').on('click',function(e)
    {
        e.preventDefault();
        var fechainicio     = $('#fecha_inicio').val();
        var fechafin        = $('#fecha_fin').val();
        if((fechafin)&&(fechainicio))
        {
            if( fechafin > fechainicio || fechainicio == fechafin)
            {
                //window.location.href = "ws/documentos/exportar?fechaini="+fechainicio+"&fechafin="+fechafin;
                llenarTabla();
                toastr["success"]("Consulta exitosa","Éxito");
            }
            else
            {
                toastr['warning']('Las fechas son invalidas revise por favor');
            }
        }
        else
        {
            toastr['warning']('Las fechas estan vacias');
        }
        
    });
//-----------------------------------------------------FUNCION PARA LLENAR TABLA-------------------------------------
    function llenarTabla(){
        $('#loader').show();
        var fechainicio     = $('#fecha_inicio').val();
        var fechafin        = $('#fecha_fin').val();
        window.tablaAreas.clear().draw();

        $.ajax({
            url:        'ws/documentos/solicitudes/reporte?fecha_inicio='+fechainicio+'&fecha_fin='+fechafin,
            type:       'GET',
            dataType:   'json',
            }
        )
        .done(function(data){       
            if( data.result ){
                contador = 0;       
                $.each(data.records, function(index,value){

                    // function capitalize(string) {
                    //     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
                    // }
                    // var nombre = capitalize(value.nombre_solicitante);
                    
                    contador++;
                    estado   = (value.estado==1?"<span class=\"label label-success\">Aprobado</span>":"<span class=\"label label-danger\">Pendiente</span>");
                    counter1 = contador;
                    counter2 = value.area ? value.area.nombre : 'Constancias' ;
                    counter3 = value.tipo_documentos ? value.tipo_documentos.nombre : value.descripcion_tipo;
                    counter4 = value.ubicacion;
                    counter5 = value.nombre_solicitante;
                    counter6 = value.usuario_solicitante;
                    counter7 = value.nombre_aprobador;
                    counter8 = value.tiempo_dias;

                    window.tablaAreas.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8]).draw(false);

                        
                });
            }
        })
        .fail(function(err){
            console.log(err);
        })  
        .always( function(){
            $("#loader").fadeOut();
        });     
    }

    $("#tabla-registros").on('click', '.btn-aprobar', function( e ){
        idSolicitud = $(e.target).closest("a").data("idsolicitud");
    });

})
