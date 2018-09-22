jQuery(document).ready(function($){
    var usuario_log="";
    var id_registro = 0;
    var usuario="";
    var jefe="";
    var sim=0;
    var sim_op=0;
    var id_registro_eliminar = 0;
        llenarTipos('#form-crear #id_tipo');
        llenarMarcas('#form-crear #id_marca');
        llenarPlanes('#form-crear #id_plan');
        llenarCompanias('#form-crear #id_compania');
        llenarTipos('#form-editar #id_tipo1');
        llenarMarcas('#form-editar #id_marca1');
        llenarPlanes('#form-editar #id_plan1');
        llenarCompanias('#form-editar #id_compania1');
        //nuevos cambios BART
        llenarContratos('#form-crear #id_contrato, #form-editar #id_contrato1');
        llenarEstados('#form-crear #id_estado, #form-editar #id_estado1'); 

        $('#id_plan').hide();
        $('#id_compania').hide();
        $('#no_telefono').hide();
        $('#sim').hide();
        $('#s2id_id_plan').hide();
        $('#s2id_id_compania').hide();

        $('#lbl1').hide();
        $('#lbl2').hide();
        $('#lbl3').hide();
        $('#lbl4').hide();
    $('#loader').fadeOut();
    $('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
    // console.log('ws/activos/equipos/'+$('#email-user').text());
    $('.chosen-select').chosen({ 'search_contains': true, 'width': '100%', 'white-space': 'nowrap', 'allow_single_deselect': true, 'disable_search_threshold':10});
    var table = $("#tabla-registros").DataTable({
        "language": 
        {
            "url": "lang/esp.lang"
        },
        processing: true,
        serverSide: true,
        ajax: {
            url: 'ws/activos/equipos/filtro',
            data: function (params) {
                params.user = $('#user_filtro').val();
                params.empid = $('#empid_filtro').val();
                params.ceco = $('#ceco_filtro').val();
                params.sociedad = $('#sociedad_filtro').val();
                console.log(params);
            }
        },
        columns: [
            {data: 'DT_Row_Index', name: 'DT_Row_Index'},
            {data: 'tipo', name: 'tipo'},
            {data: 'marca', name: 'marca'},
            {data: 'modelo', name: 'modelo'},
            {data: 'serial', name: 'serial'},
            {data: 'codigo_nombre', name: 'codigo_nombre'},
            {data: 'contrato', name: 'conrato'},
            {data: 'fecha_vencimiento', name: 'fecha_vencimiento'},
            {data: 'fecha_entrega', name: 'fecha_entrega'},
            {data: 'uid_empleado', name: 'uid_empleado'},
            {data: 'nombre_empleado', name: 'nombre_empleado'},
            {data: 'empid', name: 'empid'},
            {data: 'sociedad', name: 'sociedad'},
            {data: 'ceco', name: 'ceco'},
            {data: 'precio_costo', name: 'precio_costo'},
            {data: 'sim_nombre', name: 'sim_nombre'},
            {data: 'telefono_nombre', name: 'telefono_nombre'},
            {data: 'compania_nombre', name: 'compania_nombre'},
            {data: 'plan_nombre', name: 'plan'},
            {data: 'maletin_nombre', name: 'maletin_nombre'},
            {data: 'estado_equipo', name: 'estado_equipo'},
            {data: 'acciones', name: 'acciones'},
        ],
        order: [[0, 'asc']]
    });

    $('#consultar').on('click', function(e) {
        table.draw();
        e.preventDefault();
    });

    $('#limpiar').on('click', function(e){
        $('#user_filtro').val('');
        $('#empid_filtro').val('');
        $('#ceco_filtro').val('');
        $('#sociedad_filtro').val(0);
        e.preventDefault();
    })

    window.tablaEquiposAgregados = $("#tabla-equiposagregados").DataTable(
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

    window.tabla_registros7 = $("#tabla-registros7").DataTable(
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

function llenarTipos(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/activos/tipos',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $(selector).append($("<option />").val('0').text('Seleccione un tipo'));
                    $.each(data.records, function(index, value)
                    {
                        
                            $(selector).append($("<option />").val(value.id).text(value.nombre));
                                                
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

   function llenarMarcas(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/activos/marcas',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $(selector).append($("<option />").val('0').text('Seleccione una marca'));
                    $.each(data.records, function(index, value)
                    {
                        $(selector).append($("<option />").val(value.id).text(value.nombre));
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

    function llenarCompanias(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/activos/companias',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $(selector).append($("<option />").val('0').text('Seleccione una compañia'));
                    $.each(data.records, function(index, value)
                    {
                        $(selector).append($("<option />").val(value.id).text(value.nombre));
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
            toastr['error'](err.message, 'Error')
        })
        .always(function() { });
    }

    function llenarPlanes(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/activos/planes',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $(selector).append($("<option />").val('0').text('Seleccione un plan'));
                    $.each(data.records, function(index, value)
                    {
                        $(selector).append($("<option />").val(value.id).text(value.nombre));
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

    //Nuevos cambios BART 
    function llenarContratos(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/activos/contratos',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $(selector).append($("<option />").val('0').text('Seleccione un contrato'));
                    $.each(data.records, function(index, value)
                    {
                        $(selector).append($("<option />").val(value.id).text(value.descripcion));
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

    //Nuevos cambios BART 
    function llenarEstados(selector){
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
                    $(selector).append($("<option />").val('0').text('Seleccione un estado'));
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



function limpiar_validacion(){
    $('#sim').hide();
    $('#no_telefono').hide();
    $('#s2id_id_compania').hide();
    $('#s2id_id_plan').hide();
    $('#lbl4').hide();
    $('#lbl1').hide();
    $('#lbl2').hide();
    $('#lbl3').hide();
    $('#s2id_id_contrato >a >.select2-chosen').text('Seleccione un contrato');
    $('#s2id_id_compania >a >.select2-chosen').text('Seleccione una compañía');
    $('#s2id_id_plan >a >.select2-chosen').text('Seleccione un plan');
    $('#s2id_id_estado >a >.select2-chosen').text('Seleccione un estado');
    $('#s2id_id_marca >a >.select2-chosen').text('Seleccione una marca');
    $('#s2id_id_tipo >a >.select2-chosen').text('Seleccione un tipo');
    $(".chosen-select").val('').trigger("chosen:updated");
    $('#id_tipo').removeAttr('value');
    $('#id_tipo').removeAttr('readonly');
    $('#form-editar')[0].reset();
    $("#form-editar").validate().resetForm();
    $('#form-crear')[0].reset();
    $("#form-crear").validate().resetForm();
    $('.form-control').removeClass('valid');
    $('.form-control').removeClass('error');
    
}
    llenarTabla();
    $('#btn-crear').on('click', crearRegistro);
    $('#btn-asignar').on('click',asignar);
    $('#btn-reasignar').on('click',reasignar);
    $('#btn-desasignar').on('click',desasignar);
    $('#btn-baja-final').on('click', darBaja);
    $('#btn-buscar').on('click', buscarEquipos);
    $('#btn-cerrar').on('click', cerrar);
    $('#btn-actualizar').on('click', actualizarRegistro);
    $('#btn-eliminar').on('click', eliminarRegistro);
    $('#btn-baja').on('click',limpiarModalBaja);
    $('#btn-nuevo').on('click',function(){
       limpiar_validacion();
    });

    $('.btn-editar').on('click',function(){
       limpiar_validacion();
    });
    function limpiarModalBaja(){
        $('#uid_empleado3').val("");
         window.tabla_registros7.clear().draw();
    }
    function desasignar(){
        $.ajax({
            url:        'ws/activos/desasignar/'+id_registro,
            type:       'POST',
            dataType:   'json',
            data:       $('#form-desasignar').serialize()
        })
        .done(function(response){
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                $("#modal-desasignar").modal('hide'); 
               window.location.reload();
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }
    $('.close').on('click',function(){
        // window.location.reload();
    });
    $('#btn-cancelar').on('click',function(){
       llenarTabla();
    });
    function asignar(){
        $.ajax({
            url:        'ws/activos/asignar/'+id_registro,
            type:       'POST',
            dataType:   'json',
            data:       $('#form-asignar').serialize()
        })
        .done(function(response){
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                $("#modal-asignar").modal('hide'); 
                window.location.reload();
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }
    function reasignar(){
        $.ajax({
            url:        'ws/activos/reasignar/'+id_registro,
            type:       'POST',
            dataType:   'json',
            data:       $('#form-reasignar').serialize()
        })
        .done(function(response){
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                $("#modal-reasignar").modal('hide'); 
                var index = $("#form-reasignar").attr('data-index');
                var data = table.row(index).data();
                data.nombre_empleado = response.records.nombre_empleado;
                data.uid_empleado = response.records.uid_empleado;
                data.empid = response.records.empid;
                console.log(data);
                table.row(index).data(data).draw();
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
        $('#uid_empleado_reasignar').val('');
        $('$uid_empleado_reasignar').value = 0;
    }

    /*function llenarTabla(){
        window.tabla_registros.clear().draw();
        $('#loader').show();
        $.ajax({
            url:        'ws/activos/equipos',
            type:       'GET',
            dataType:   'json'
        })
        .done(function(response){
            var data = [];
            if (response.result) {
                cont = 0; acciones = '';
                console.log(response.records);
                $.each(response.records, function(index, value) {
                    if (value.estado!=3) {
                        if (value.uid_empleado=="") {
                             acciones =  '<td>'+
                                    '<a class="btn btn-success btn-xs btn-agregar" title="Agregar equipos adicionales" style="margin-right:3px;" href="#modal-agregarEquipos" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-sitemap"></i></a>'+
                                    '<a class="btn btn-primary btn-xs btn-editar" title="Editar" style="margin-right:3px;" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"> <i class="fa fa-pencil"></i></a>'+
                                    '<a class="btn btn-danger btn-xs btn-eliminar" title="Eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash"></i></a>'+
                                    '<a class="btn btn-success btn-xs btn-asignar" title="Asignar" style="margin:3px;" href="#modal-asignar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-check"></i></a>'+
                                '</td>';
                        } else {
                             acciones =  '<td>'+
                                    '<a class="btn btn-success btn-xs btn-agregar" title="Agregar equipos adicionales" style="margin-right:3px;" href="#modal-agregarEquipos" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-sitemap"></i></a>'+
                                    '<a class="btn btn-primary btn-xs btn-editar" title="Editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
                                    '<a class="btn btn-danger btn-xs btn-eliminar" title="Eliminar" style="margin:3px;" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash"></i></a>'+
                                    '<a class="btn btn-success btn-xs btn-reasignar" title="Reasignar" href="#modal-reasignar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-mail-reply-all"></i></a>'+
                                    '<a class="btn btn-info btn-xs btn-desasignar" title="Desasignar" style="margin:3px;" href="#modal-desasignar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-ban"></i></a>'+
                                '</td>';
                        }
                        col1  = ++cont;
                        if (value.tipo!=null) {
                            col2  = value.tipo;
                        } else {
                            col2  = 'Sin tipo';
                        }
                        if (value.marca!=null) {
                            col3  = value.marca;
                        } else {
                            col3  = 'Sin marca';
                        }
                        col4  = value.modelo;
                        col5  = value.serial;
                        col6  = value.codigo;
                        if (value.contrato!=null) {
                            col7  = value.contrato;
                        } else {
                            col7  = 'Sin contrato';
                        }
                        col8  = value.fecha_vencimiento;
                        col10 = value.fecha_entrega;
                        col11 = value.uid_empleado;
                        col12 = value.empid;
                        col13 = value.precio_costo;
                        if (value.id_tipo==1) {
                            col14 = value.sim
                            col15 = value.no_telefono;
                            if (value.compania!=null) {
                                col16 = value.compania;
                            } else {
                                col16 = 'Sin compañía';
                            }
                            if (value.plan!=null) {
                                col17 = value.plan;
                            } else {
                                col17 = 'Sin plan';
                            }
                        } else {
                            col14 = "Sin sim";
                            col15 = "Sin telefono";
                            col16 = "Sin Compañia";
                            col17 = "Sin Plan";
                        }
                        col18 = value.maletin == 1 ? "Si" : "No"; //nuevo bart
                        if (value.estado_equipo!=null) {
                             col19 = value.estado_equipo; //nuevo bart
                        } else {
                             col19 = 'Sin estado'; //nuevo bart
                        }
                        col20 = acciones;
                        window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col10,col11,col12,col13,col14,col15,col16,col17,col18,col19,col20]).draw(false);
                     } 
                });           
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }*/

   $('#opcion').on('click',function(){
        var a = $("#opcion").prop("checked");
        if (a) {
            sim=1;
            $('#s2id_id_tipo').prop('value','1');
            $('#s2id_id_tipo').attr('value','1');
            $('#s2id_id_tipo').val('1');
            $('#id_tipo').prop('value','1');
            $('#id_tipo').attr('value','1');
            $('#id_tipo').val('1');
            $('#s2id_id_tipo >a >.select2-chosen').text('Celular');
            $('#id_tipo').attr('readonly','readonly');
            $('#s2id_id_plan').show();
            $('#s2id_id_compania').show();
            $('#no_telefono').show();
            $('#sim').show();
            $('#lbl1').show();
            $('#lbl2').show();
            $('#lbl3').show();
            $('#lbl4').show();
            $("#form-crear").validate({
                rules:{
                    id_tipo:{
                        required: true,
                    },
                    id_marca:{
                        required: true,
                    },
                    modelo:{
                        required: true,
                    },
                    serial:{
                        required: true,
                    },
                    codigo:{
                        required: true,
                    },
                    id_contrato:{
                        required: true,
                    },
                    fecha_vencimiento:{
                        required: true,
                    },
                    id_estado:{
                        required: true,
                    },
                    fecha_entrega:{
                        required: true,
                    }
                },
                messages:{
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_marca:{
                        required: 'Este campo es obligatorio'
                    },
                    modelo:{
                        required: 'Este campo es obligatorio'
                    },
                    serial:{
                        required: 'Este campo es obligatorio'
                    },
                    codigo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_contrato:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_vencimiento:{
                        required: 'Este campo es obligatorio'
                    },
                    id_estado:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_entrega:{
                        required: 'Este campo es obligatorio'
                    }
                }
            });
        } 
        else {
            sim=0;
            $('#id_tipo').removeAttr('value');
            $('#select2-chosen-1').text('Seleccione un tipo');
            $('#id_tipo').removeAttr('readonly');
            
            $('#s2id_id_plan').hide();
            $('#s2id_id_compania').hide();
            $('#no_telefono').hide();
            $('#sim').hide();

            $('#lbl1').hide();
            $('#lbl2').hide();
            $('#lbl3').hide();
            $('#lbl4').hide();
            
            $("#form-crear").validate({
                rules:{
                    id_tipo:{
                        required: true,
                    },
                    id_marca:{
                        required: true,
                    },
                    modelo:{
                        required: true,
                    },
                    serial:{
                        required: true,
                    },
                    codigo:{
                        required: true,
                    },
                    id_contrato:{
                        required: true,
                    },
                    fecha_vencimiento:{
                        required: true,
                    },
                    id_estado:{
                        required: true,
                    },
                    fecha_entrega:{
                        required: true,
                    },
                    no_telefono:{
                        required: true,
                    },
                    id_compania:{
                        required: true,
                    },
                    id_marca:{
                        required: true,
                    },
                    id_estado:{
                        required: true,
                    }
                },
                messages:{
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_marca:{
                        required: 'Este campo es obligatorio'
                    },
                    modelo:{
                        required: 'Este campo es obligatorio'
                    },
                    serial:{
                        required: 'Este campo es obligatorio'
                    },
                    codigo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_contrato:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_vencimiento:{
                        required: 'Este campo es obligatorio'
                    },
                    id_estado:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_entrega:{
                        required: 'Este campo es obligatorio'
                    },
                    no_telefono:{
                        required: 'Este campo es obligatorio'
                    },
                    id_compania:{
                        required: 'Este campo es obligatorio'
                    },
                    id_marca:{
                        required: 'Este campo es obligatorio'
                    },
                    id_estado:{
                        required: 'Este campo es obligatorio'
                    }
                }
            });
        }
    });
    
    $('#opcion1').on('click',function(){
        var b = $("#opcion1").prop("checked");
        if (b) {
            sim=1;
            $('#s2id_tipo1').prop('value','1');
            $('#id_tipo1').prop('value','1');
            $('#id_tipo1').attr('readonly','readonly');
            $('#lbl6').show();
            $('#lbl5').show();
            $('#lbl7').show();
            $('#lbl8').show();
            $('#s2id_id_plan1').show();
            $('#sim1').show();
            $('#id_compania1').hide();
            $('#s2id_id_compania1').show();
            $('#no_telefono1').show();
            $('#sim1').show();

            $("#form-editar").validate({
                rules:{
                    id_tipo:{
                        required: true,
                    },
                    id_marca:{
                        required: true,
                    },
                    modelo:{
                        required: true,
                    },
                    serial:{
                        required: true,
                    },
                    codigo:{
                        required: true,
                    },
                    id_contrato:{
                        required: true,
                    },
                    fecha_vencimiento:{
                        required: true,
                    },
                    id_estado:{
                        required: true,
                    },
                    fecha_entrega:{
                        required: true,
                    }
                },
                messages:{
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_marca:{
                        required: 'Este campo es obligatorio'
                    },
                    modelo:{
                        required: 'Este campo es obligatorio'
                    },
                    serial:{
                        required: 'Este campo es obligatorio'
                    },
                    codigo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_contrato:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_vencimiento:{
                        required: 'Este campo es obligatorio'
                    },
                    id_estado:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_entrega:{
                        required: 'Este campo es obligatorio'
                    }
                }
            });
        } 
        else {
            sim=0;
            $('#id_tipo1').removeAttr('readonly');
           
            $('#lbl6').hide();
            $('#lbl5').hide();
            $('#lbl7').hide();
            $('#lbl8').hide();
            $('#s2id_id_plan1').hide();
            $('#sim1').hide();
            $('#id_compania1').hide();
            $('#s2id_id_compania1').hide();
            $('#no_telefono1').hide();
            $('#sim1').hide();

            $("#form-editar").validate({
                rules:{
                    id_tipo:{
                        required: true,
                    },
                    id_marca:{
                        required: true,
                    },
                    modelo:{
                        required: true,
                    },
                    serial:{
                        required: true,
                    },
                    codigo:{
                        required: true,
                    },
                    id_contrato:{
                        required: true,
                    },
                    fecha_vencimiento:{
                        required: true,
                    },
                    fecha_entrega:{
                        required: true,
                    },
                    no_telefono:{
                        required: true,
                    },
                    id_compania:{
                        required: true,
                    },
                    id_marca:{
                        required: true,
                    },
                    id_estado:{
                        required: true,
                    }
                },
                messages:{
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_tipo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_marca:{
                        required: 'Este campo es obligatorio'
                    },
                    modelo:{
                        required: 'Este campo es obligatorio'
                    },
                    serial:{
                        required: 'Este campo es obligatorio'
                    },
                    codigo:{
                        required: 'Este campo es obligatorio'
                    },
                    id_contrato:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_vencimiento:{
                        required: 'Este campo es obligatorio'
                    },
                    fecha_entrega:{
                        required: 'Este campo es obligatorio'
                    },
                    no_telefono:{
                        required: 'Este campo es obligatorio'
                    },
                    id_compania:{
                        required: 'Este campo es obligatorio'
                    },
                    id_marca:{
                        required: 'Este campo es obligatorio'
                    },
                    id_estado:{
                        required: 'Este campo es obligatorio'
                    }
                }
            });
        }
    });

    function cerrar(){
        $('#id_plan').hide();
        $('#id_compania').hide();
        $('#no_telefono').hide();
        $('#sim').hide();
        $('#s2id_id_plan').hide();
        $('#s2id_id_compania').hide();

        $('#lbl1').hide();
        $('#lbl2').hide();
        $('#lbl3').hide();
        $('#lbl4').hide();
    }    

    function buscarEquipos(){
        var cont=0;
        window.tabla_registros7.clear().draw();
        $.ajax({
            url:        'ws/activos/buscar/equipos',
            type:       'GET',
            dataType:   'json',
            data:       $('#form-baja').serialize()
            })
            .done(function(response){
                if (response.result) {
                    $.each(response.records, function(index, value) {
                        if (value.estado!="3") {
                            col1  = ++cont;
                            if (value.tipo) {
                                col2  = value.tipo['nombre'];
                            } else {
                                col2  = "Sin tipo";
                            }
                            if (value.marca) {
                                 col3  = value.marca['nombre'];
                            } else {
                                 col3  = "Sin marca";
                            }
                            col4  = value.modelo;
                            col5  = value.serial;
                            col6  = value.codigo;
                            if (value.contrato) {
                                col7  = value.contrato['descripcion'];
                            } else {
                                col7  = "Sin descripción";
                            }
                            col8  = value.fecha_vencimiento;
                            col9  = value.fecha_entrega;
                            col10 = value.uid_empleado;
                            col11 = value.empid;
                            if (value.id_tipo==1) {
                                col12 = value.sim
                                col13 = value.no_telefono;
                                if (value.compania) {
                                    col14 = value.compania['nombre'];
                                } else {
                                    col14 = "Sin compañía";
                                }
                                if (value.plan) {
                                    col15 = value.plan['nombre'];
                                } else {
                                    col15 = "Sin plan";
                                }
                            } else {
                                col12 = "Sin sim";
                                col13 = "Sin telefono";
                                col14 = "Sin Compañia";
                                col15 = "Sin Plan";
                            }
                            col16 = value.maletin == 1 ? "Si" : "No"; //nuevo bart
                            if (value.estadoequipo) {
                                col17 = value.estadoequipo['estado']; //nuevo bart
                            } else {
                                col17 = "Sin estado"; //nuevo bart
                            }
                            window.tabla_registros7.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,col17]).draw(false);
                        } 
                    });
                    if (cont<1){
                        toastr['error']('El usuario no cuenta con equipos asignados', 'Error');  
                    }
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); })
    }

    function crearRegistro(){
        if ($('#form-crear').valid()) {
            if ($('#id_tipo').val()!=0){
                if ($('#id_marca').val()!=0){
                    $('#loader').show();
                    $.ajax({
                        url:        'ws/activos/equipos',
                        type:       'POST',
                        dataType:   'json',
                        data:       $('#form-crear').serialize()
                    })
                    .done(function(response){
                        if (response.result) {
                            toastr['success'](response.message, 'Éxito');
                            $("#modal-crear").modal('hide'); 
                            window.location.reload();
                        } else {
                            toastr['error'](response.message, 'Error');
                        }
                    })
                    .fail(function(response){
                        toastr['error'](response.message, 'Error');
                    })
                    .always(function(){ $('#loader').fadeOut(); })
                }
                else{
                      toastr['error']('Debe de seleccionar una marca', 'Error');
                }
            }
            else{
                toastr['error']('Debe de seleccionar un tipo', 'Error');
            }
        }
    }

    $('#tabla-registros').on('click', 'a.btn-reasignar', function(){
        var index = Number($(this).parent().siblings().eq(0).text()) - 1;
        id_registro = $(this).data('idregistro');
        $.ajax({
            url:        'ws/activos/equipos/show/'+id_registro,
            type:       'GET',
            dataType:   'json',
        })
        .done(function(response){
             $('#uid_empleado_anterior').val(response.records.uid_empleado);
             $('#form-reasignar').attr('data-index', index);
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    });

    $('#tabla-registros').on('click', 'a.btn-editar', function(){
        limpiar_validacion();
        id_registro = $(this).data('idregistro');
        $.ajax({
            url:        'ws/activos/equipos/show/'+id_registro,
            type:       'GET',
            dataType:   'json',
        })
        .done(function(response){
            if (response.result) { 
                if (response.records.tipo) {
                    $('#s2id_id_tipo1 >a >.select2-chosen').text(response.records.tipo.nombre);
                }
                if (response.records.marca) {
                     $('#s2id_id_marca1 >a >.select2-chosen').text(response.records.marca.nombre);
                } 
                if (response.records.contrato) {
                   $('#s2id_id_contrato1 >a >.select2-chosen').text(response.records.contrato.descripcion); 
                } 
                if (response.records.estadoequipo) {
                    $('#s2id_id_estado1 >a >.select2-chosen').text(response.records.estadoequipo.estado);
                }
                if (response.records.modelo) {
                    $('#form-editar #modelo1').val(response.records.modelo);
                }
                if (response.records.serial) {
                    $('#form-editar #serial1').val(response.records.serial);
                }
                if (response.records.codigo) {
                    $('#form-editar #codigo1').val(response.records.codigo);
                }

                if (response.records.id_tipo) {
                    $('#form-editar #id_tipo1').val(response.records.id_tipo).trigger('chosen:updated');
                }

                if (response.records.id_marca) {
                    $('#form-editar #id_marca1').val(response.records.id_marca).trigger('chosen:updated');
                }

                if (response.records.id_contrato) {
                    $('#form-editar #id_contrato1').val(response.records.id_contrato).trigger('chosen:updated');
                }

                if (response.records.id_estado) {
                    $('#form-editar #id_estado1').val(response.records.id_estado).trigger('chosen:updated');
                }

                if (response.records.id_compania) {
                    $('#form-editar #id_compania1').val(response.records.id_compania).trigger('chosen:updated');
                }

                if (response.records.id_plan) {
                    $('#form-editar #id_plan1').val(response.records.id_plan).trigger('chosen:updated');
                }

                if (response.records.fecha_vencimiento) {
                    $('#form-editar #fecha_vencimiento1').val(response.records.fecha_vencimiento);
                }

                if (response.records.fecha_entrega) {
                    $('#form-editar #fecha_entrega1').val(response.records.fecha_entrega);
                }

                if (response.records.uid_empleado) {
                    $('#form-editar #uid_empleado1').val(response.records.uid_empleado);
                }

                if (response.records.precio_costo) {
                    $('#form-editar #costo1').val(response.records.precio_costo);
                }

                if (response.records.empid) {
                    $('#form-editar #empid1').val(response.records.empid);
                }

                if (response.records.sociedad) {
                    $('#form-editar #sociedad').val(response.records.sociedad);
                }

                if (response.records.ceco) {
                    $('#form-editar #ceco').val(response.records.ceco);
                }

                if (response.records.no_telefono) {
                    $('#form-editar #no_telefono1').val(response.records.no_telefono);
                }

                if (response.records.id_tipo) {
                    sim_op = response.records.id_tipo;
                }

                if(sim_op==1){
                    $("#opcion1").prop("checked", true);  
                    $('#id_tipo1').prop('value','1');
                    $('#lbl6').show();
                    $('#lbl5').show();
                    $('#lbl7').show();
                    $('#lbl8').show();
                    $('#s2id_id_plan1').show();
                    $('#id_plan1').hide();
                    $('#id_compania1').hide();
                    $('#s2id_id_compania1').show();
                    $('#no_telefono1').show();
                    $('#sim1').show();
                    $('#sim1').val(response.records.sim);
                    if (response.records.compania && response.records.compania.nombre){
                        $('#s2id_id_compania1 >a >.select2-chosen').text(response.records.compania.nombre);
                    }
                    if (response.records.plan && response.records.plan.nombre) {
                        $('#s2id_id_plan1 >a >.select2-chosen').text(response.records.plan.nombre);
                    }

                    // $('#id_tipo1').attr('readonly','readonly');
                    
                }else{
                    // $('#id_tipo1').removeAttr('readonly');
                    $('#id_tipo1').removeAttr('value');
                    $('#id_tipo1').removeAttr('readonly');
                    $('#lbl6').hide();
                    $('#lbl5').hide();
                    $('#lbl7').hide();
                    $('#lbl8').hide();
                    $('#s2id_id_plan1').hide();
                    $('#sim1').hide();
                    $('#id_compania1').hide();
                    $('#s2id_id_compania1').hide();
                    $('#no_telefono1').hide();
                    $('#sim1').hide();
                 
                }

                if(response.records.maletin == 1){
                    $("#si").prop("checked", true);
                    $("#no").prop("checked", false);
                }
                else{
                    $("#si").prop("checked",false);
                    $("#no").prop("checked",true);   
                }
                $("#modal-editar").modal('show'); 

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
            console.log($('#form-editar').serialize());
            $.ajax({
                url:        'ws/activos/equipos/'+id_registro,
                type:       'PUT',
                dataType:   'json',
                data:       $('#form-editar').serialize()
            })
            .done(function(response){
                if (response.result) {
                    toastr['success'](response.message, 'Éxito');
                    $("#modal-editar").modal('hide'); 
                    window.location.reload();
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

    $('#tabla-registros').on('click', 'a.btn-desasignar', function(){
        id_registro = $(this).data('idregistro');
    });

    $('#tabla-registros').on('click', 'a.btn-asignar', function(){
        id_registro = $(this).data('idregistro');
    });
    $('#tabla-registros').on('click', 'a.btn-reasignar', function(){
        id_registro = $(this).data('idregistro');
    });

    function darBaja(){
        $usuario=$('#uid_empleado3').val();
        $.ajax({
            url:        'ws/vacaciones/diasdisponibles',
            type:       'GET',
            dataType:   'json',
            data:       {user:$usuario}
        })
        .done(function(response){
            if (response.result) {
                $jefe = response.records.USUARIOS.item[0].UNAME;
                $jefe = $jefe.concat("@FIFCO.COM");
                $usuario_log = $('#usuario_log').val();   
                $.ajax({
                    url:        'ws/activos/asignar/jefe',
                    type:       'GET',
                    dataType:   'json',
                    data:       {uid_empleado:$usuario,jefe:$jefe,usuario_log:$usuario_log}
                })
                .done(function(response){
                    if (response.result) {
                        toastr['success'](response.message, 'El usuario ha sido dado de baja')  
                         $("#modal-baja").modal('hide'); 
                         window.location.reload();
                    } else {
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function(response){
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){ $('#loader').fadeOut(); })



            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }



    function eliminarRegistro(){
        $.ajax({
            url:        'ws/activos/equipos/'+id_registro_eliminar,
            type:       'DELETE',
            dataType:   'json',
            data:       $('#form-desasignar').serialize()
        })
        .done(function(response){
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                $("#modal-eliminar").modal('hide'); 
                window.location.reload();
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
            id_tipo:{
                required: true,
            }
        },
        messages:{
             id_tipo:{
                required: 'Este campo es obligatorio'
            }
        }
    });

    //-------------------------------------------------------EVENTOS-------------------------------------
    $('#btn-agregarequipo').on('click',agregarEquipo);

    //----------------------------------------------- FUNCION DE BOTON AGREGAR ------------------------------
    $("#tabla-registros").on('click', '.btn-agregar', function( e ){
        e.preventDefault();
        llenarTablaEquiposAgregados($(this).data('idregistro'));
         $('#serial_adicional').val('');
        $('#descripcion').val('');
        $('.form-control').removeClass('valid');
        $('.form-control').removeClass('error');
        $('.error').hide();
    });

    //----------------------------------------FUNCION PARA LLENAR TABLA DE EQUIPOS AGREGADOS--------------
    function llenarTablaEquiposAgregados( idequipo )
    {
        selectAreas('#form-agregarequipos #id_tipo');
        $('#form-agregarequipos #id_equipo').val(idequipo);
        window.tablaEquiposAgregados.clear().draw();
        $.ajax({
            url:        'ws/activos/agregados/'+idequipo,
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data){
            if( data.result ){      
                contador = 0;       
                $.each(data.records, function(index,value){
                    contador++;
                    counter1 = contador;
                    if (value.tipo) {
                        counter2 = value.tipo.nombre;
                    } else {
                        counter2 = 'Sin tipo';
                    }
                    
                    counter3 = value.serial;
                    counter4 = value.descripcion;
                    counter5 = '<center><a style="margin-left:3px;" class="btn-eliminarequipo btn btn-danger btn-xs" data-ideliminarequipo="'+value.id+'"><i class="fa fa-times-circle"></i></a></center>';
                    window.tablaEquiposAgregados.row.add([counter1,counter2,counter3,counter4,counter5]).draw(false);
                });
            }
        })
        .fail(function(err){
            toastr['error'](err.message, 'Error');
        })
    }

    //--------------------------------------------SELECT EQUIPOS-------------------------------------------
    function selectAreas(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/activos/tipos',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
            {   
                $(selector).find('option').remove().end();
                $(selector).append($("<option />").val('0').text('Seleccione un equipo'));
                
                $.each(data.records, function(index, value)
                {
                    $(selector).append($("<option />").val(value.id).text(value.nombre));
                });
                
                $(selector).select2({ });
            }
        })
        .fail(function( err )
        {
           toastr['error'](err.message, 'Error');
        })
        .always(function() { });
    }

    //----------------------------------------FUNCION AGREGAR EQUIPO---------------------------
    function agregarEquipo( e )
    {
        e.preventDefault();
        if( $( '#form-agregarequipos' ).valid() )
        {
            $.ajax(
            {
                type:       'POST',
                url:        'ws/activos/agregar',
                dataType:   'json',
                data:       $('#form-agregarequipos').serialize(),
                success: function( result )
                    {
                        if( result.result )
                        {
                            idequipo = $('#form-agregarequipos #id_equipo').val();
                            llenarTablaEquiposAgregados(idequipo);
                            toastr['success'](result.message, 'Éxito');
                            $('#serial_adicional').val('');
                            $('#descripcion').val('');
                            $('.form-control').removeClass('valid');
                        }
                        else
                        {
                            toastr['error'](result.message, 'Error');
                        }
                    },
                error:  function( result )
                    {
                        toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                    }
            });
        }
    }

    function llenarTabla()
    {

    }

    //----------------------------------------FUNCION AGREGAR EQUIPO---------------------------
    $("#tabla-equiposagregados").on('click', '.btn-eliminarequipo', function( e ){
        e.preventDefault();
        ideliminarequipo = $(e.target).closest("a").data("ideliminarequipo");
        $.ajax
        ({
            type:   "GET",
            url:    'ws/activos/eliminaragregado/'+ideliminarequipo,
            success: function( result )
            {
                if( result.result )
                {
                    idequipo = $('#form-agregarequipos #id_equipo').val();
                    llenarTablaEquiposAgregados(idequipo);
                    toastr['success'](result.message, 'Éxito')
                }
                else
                {
                    toastr['error'](result.message, 'Error');
                }
            },
            error: function( result )
            {
                toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
            }
        });
    });


    const Email = {
        validateEmail: function (email) {
            const pattern_email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

            if (pattern_email.test(email)) {
                return true;
            }

            return false;

        }
    };


});
