jQuery(document).ready(function($){

    var id_registro = 0;
    var sim=0;
    var sim_op=0;
    var id_registro_eliminar = 0;

    $('.chosen-select').chosen({ 'search_contains': true, 'width': '100%', 'white-space': 'nowrap', 'allow_single_deselect': true, 'disable_search_threshold':10});
    $('#loader').fadeOut();
    window.tabla_registros = $("#tabla-registros").DataTable(
    {
        language: {
            url: 'lang/esp.lang'
        },
        deferRender: true,
        processing: true,
        //serverSide: true,
        ajax: 'ws/activos/historial',
        columns: [
            {data: 'DT_Row_Index'},
            {data: 'accion'},
            {data: 'tipo'},
            {data: 'marca'},
            {data: 'modelo'},
            {data: 'serial'},
            {data: 'codigo'},
            {data: 'contrato'},
            {data: 'fecha_vencimiento'},
            {data: 'estado'},
            {data: 'fecha_entrega'},
            {data: 'asignado'},
            {data: 'reasignado'},
            {data: 'sim'},
            {data: 'no_telefono'},
            {data: 'compania'},
            {data: 'plan'},
            {data: 'maletin'},
            {data: 'usuario_log'},
            {data: 'created_at'}
        ],
        columnDefs: {
            searchable: false,
            targets: [0] 
        }
        /*"oLanguage": {
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
        }*/
    });
    llenarTabla();
    function llenarTabla(){
        //window.tabla_registros.clear().draw();
        /*$('#loader').show();
        $.ajax({
            url:        'ws/activos/historial',
            type:       'GET',
            dataType:   'json'
        })
        .done(function(response){

            if (response.result) {
                cont = 0; acciones = '';
                $.each(response.records, function(index, value) {
                    var objeto = jQuery.parseJSON( value.detalle );
                    col1  = ++cont;
                    col2  = objeto.accion;
                    if (objeto.tipo) {
                    	 col3  = objeto.tipo;
                    } else {
                    	 col3  = "Sin tipo";
                    }
                    if (objeto.marca) {
                    	col4  = objeto.marca;
                    } else {
                    	col4  = "Sin marca";
                    }
                    col5  = objeto.modelo;
                    col6  = objeto.serial;
                    col7  = objeto.codigo;
                    col8  = objeto.contrato;
                    col9  = objeto.fecha_vencimiento;
                    col10 = objeto.estado;
                    col11 = objeto.fecha_entrega;
                    col12 = objeto.uid_asigno;
                    col13 = objeto.uid_reasigno;
                    col14 = objeto.sim;
                    col15 = objeto.no_telefono;
                    if (value.tipo=="Celular") {
                        col16 = objeto.compañia;
                        col17 = objeto.plan;
                    } else {
                        col16 = "Sin compañia";
                        col17 = "Sin plan";
                    }
                    if (objeto.maletin == "1") {
                        col18 = "Si";
                    } else {
                        col18 = "No";
                    }
                    
                    col19 = objeto.usuario_log;
                    col20 = value.created_at;
                    window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,col17,col18,col19,col20]).draw(false);
                });
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })*/
    }    
});