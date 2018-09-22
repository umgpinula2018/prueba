jQuery(document).ready(function($){
    $('#consultar').on('click', llenarTabla);

    // window.tabla_registros = $("#tabla-registros").DataTable({
    //     paging: false,
    //     searching: false,
    //         "language": 
    //         {
    //             "url": "lang/esp.lang"
    //         },
    //     });

    llenarTipos('#estado_fisico');
    function llenarTipos(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/activos/estadoequipo',
            dataType:   'json',
        })
        .done(function( data )
        {
           if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $(selector).append($("<option />").val('0').text('Seleccione el estado físico del equipo'));
                    $.each(data.records, function(index, value)
                    {
                        $(selector).append($("<option />").val(value.id).text(value.estado));
                    });
                    $(selector).select2({ });
                }
                else
                {
                    toastr['error'](result.message, 'Error');
                }
        })
        .fail(function( err )
        {
             toastr['error'](err.message, 'Error');
        })
        .always(function() { });
    }
   
    function llenarTabla(e){
        window.tabla_registros = $("#tabla-registros").DataTable({
            destroy: true,
            "language": 
            {
                "url": "lang/esp.lang"
            },
            deferRender: true,
            processing: true,
            serverSide: true,
            ajax: 'ws/activos/consultareportes?estado='+$('#estado').val()+'&estado_fisico='+$('#estado_fisico').val()+'&sociedad='+$('#sociedad').val(),
            columns: [
                {data: 'DT_Row_Index', name: 'DT_Row_Index',},
                {data: 'tipo', name: 'tipo'},
                {data: 'marca', name: 'marca'},
                {data: 'modelo', name: 'modelo'},
                {data: 'serial', name: 'serial'},
                {data: 'codigo_nombre', name: 'codigo'},
                {data: 'contrato', name: 'contrato'},
                {data: 'fecha_vencimiento', name: 'fecha_vencimiento'},
                {data: 'fecha_entrega', name: 'fecha_entrega'},
                {data: 'uid_empleado', name: 'uid_empleado'},
                {data: 'nombre_empleado', name: 'nombre_empleado'},
                {data: 'empid', name: 'empid'},
                {data: 'sociedad', name: 'sociedad'},
                {data: 'ceco', name: 'ceco'},
                {data: 'precio_costo', name: 'precio_costo'},
                {data: 'sim_nombre', name: 'sim'},
                {data: 'telefono_nombre', name: 'no_telefono'},
                {data: 'compania_nombre', name: 'compania'},
                {data: 'plan_nombre', name: 'plan'},
                {data: 'maletin_nombre', name: 'maletin'},
                {data: 'estado_equipo', name: 'estado'},
            ],
            'columnDefs': 
            [
                { 'searchable': false, 'targets': [0] }
            ],
            order:[[ 1, "ASC" ]]
        });  
    }
    //  function llenarTabla(e){
    //     console.log($('#estado_fisico').val());
    //     window.tabla_registros.destroy();
    //     window.tabla_registros = $("#tabla-registros").DataTable({
    //         "language": 
    //         {
    //             "url": "lang/esp.lang"
    //         },
    //         deferRender: true,
    //         processing: true,
    //         serverSide: true,
    //         ajax: 'ws/activos/consultareportes?estado='+$('#estado').val()+'&estado_fisico='+$('#estado_fisico').val()+'&sociedad='+$('#sociedad').val(),
    //         columns: [
    //             {data: 'DT_Row_Index', name: 'DT_Row_Index',},
    //             {data: 'tipo', name: 'tipo'},
    //             {data: 'marca', name: 'marca'},
    //             {data: 'modelo', name: 'modelo'},
    //             {data: 'serial', name: 'serial'},
    //             {data: 'codigo_nombre', name: 'codigo_nombre'},
    //             {data: 'contrato', name: 'conrato'},
    //             {data: 'fecha_vencimiento', name: 'fecha_vencimiento'},
    //             {data: 'fecha_entrega', name: 'fecha_entrega'},
    //             {data: 'uid_empleado', name: 'uid_empleado'},
    //             {data: 'nombre_empleado', name: 'nombre_empleado'},
    //             {data: 'empid', name: 'empid'},
    //             {data: 'sociedad', name: 'sociedad'},
    //             {data: 'ceco', name: 'ceco'},
    //             {data: 'precio_costo', name: 'precio_costo'},
    //             {data: 'sim_nombre', name: 'sim_nombre'},
    //             {data: 'telefono_nombre', name: 'telefono_nombre'},
    //             {data: 'compania_nombre', name: 'compania_nombre'},
    //             {data: 'plan_nombre', name: 'plan'},
    //             {data: 'maletin_nombre', name: 'maletin_nombre'},
    //             {data: 'estado_equipo', name: 'estado_equipo'},
    //         ],
    //         'columnDefs': 
    //         [
    //             { 'searchable': false, 'targets': [0] }
    //         ],
    //         order:[[ 1, "ASC" ]]
    //     });  
    // }

    $('#exportar').on('click',function(e)
    {
        e.preventDefault();
        var estado            = $('#estado').val();
        var estado_fisico     = $('#estado_fisico').val();
        var sociedad          = $('#sociedad').val();
        if( estado > 0 | estado_fisico > 0 | sociedad != "")
        {
            window.location.href = "ws/activos/exportar?estado="+estado+"&estado_fisico="+estado_fisico+"&sociedad="+sociedad;
            toastr["success"]("Generando archivo", "Por favor espere");
        }
        else
            toastr['warning']('Debe de seleccionar al menos una opcion');
    });

    $('#loader').fadeOut();

});