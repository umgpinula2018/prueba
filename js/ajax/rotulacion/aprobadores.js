jQuery(document).ready(function ($) {
    var id = 0;
    var type_user;
    var cont = 1;
    var cont_edit = 1;
    var show = 1;
    window.tabla_flujos_aprobacion = $("#tabla-aprobador").DataTable(
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

    fillTable();
    fillTypeUser();

    $('#btn-new').on('click', clear);
    $('#btn-create').on('click', store);
    $('#btn-update').on('click', update);
    $('#btn-remove').on('click', remove);

    $('#btn-add').on('click', addSuper);

    function fillTypeUser() {
        $.ajax(
            {
                type: 		'GET',
                url: 		'ws/rotulacion/tipos/usuarios',
                dataType: 	'json',
            })
            .done(function( data )
            {
                if( data.result )
                {
                    type_user = data.records;
                }
                else
                    console.log(data.message);
            })
            .fail(function( err )
            {
                console.log( err );
            })
            .always(function() { });
    }

    function fillTable(){
        window.tabla_flujos_aprobacion.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/rotulacion/aprobadores',
            type: 		'GET',
            dataType: 	'json'
        })
            .done(function(response){
                if (response.result) {
                    cont = 0; acciones = '';
                    $.each(response.records, function(index, value) {

                        acciones =  '<td>' +
                                        '<a class="btn btn-primary btn-xs btn-edit" href="#modal-edit" data-toggle="modal"  data-idflujo="'+value.id+'" title="Actualizar flujo de aprobación"><i class="fa fa-pencil"></i></a>'+
                                        '<a class="btn btn-danger btn-xs btn-remove" href="#modal-remove" data-toggle="modal"  data-idflujo="'+value.id+'" style="margin-left: 5px;" title="Eliminar flujo de aprobación"><i class="fa fa-trash"></i></a>'+
                                        '<a class="btn btn-info btn-xs btn-supervisor" href="#modal-supervisores" data-toggle="modal"  data-iduser="'+value.id+'" style="margin-left: 5px;" title="Detalle de los supervisores aprobadores"><i class="fa fa-list-alt"></i></a>'+
                                    '</td>';

                        col1 = ++cont;
                        if (value.rotulacion == 1){
                            col2 = 'Retiro de rotulación';
                        } else if (value.rotulacion == 2){
                            col2 = 'Nueva instalación de rotulación';
                        } else {
                            col2 = 'Matenimiento de rotulación';
                        }
                        col3 = value.tipo_rotulacion == 0 ? '<span class="label label-default">Lineal</span></center>': '<span class="label label-info">Especial</span>';
                        col4 = acciones;
                        window.tabla_flujos_aprobacion.row.add([col1,col2,col3,col4]).draw(false);
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

    function clear() {
        $('input:radio').removeAttr('checked');
        $('input:checkbox').removeAttr('checked');
        $('#form-create #container').parent().empty();
        $('#info').text('Añadir supervisor');
        cont = 0;
    }

    function store(e) {
        e.preventDefault();
        if( $('#form-create').valid() )
        {
            if ($('#retirement').prop('checked') || $('#installation').prop('checked') || $('#maintenance').prop('checked')) {
                if ($('#linear').prop('checked') || $('#special').prop('checked')) {
                    var array      = [];
                    var permission = $("input:radio[name=permission]:checked").val();
                    var type       = $("input:radio[name=type]:checked").val();
                    var selects    = $('select.value-data').find('option:selected');
                    var proceso    = 1;
                    selects.each( function(){
                        var id      = $(this).val();
                        var string  = $(this).text();

                        if (id != 0){
                            var object = {};
                            object.id       = id;
                            object.name     = getCleanedString(string);
                            object.proceso  = proceso;
                            array.push(object);
                            proceso++;
                        }
                    });
                    var valueArr = array.map(function(item){ return item.id });
                    var isDuplicate = valueArr.some(function(item, idx){return valueArr.indexOf(item) != idx});
                    if (array.length > 0) {
                        if (!isDuplicate) {
                            $.ajax({
                                url: 		'ws/rotulacion/aprobadores',
                                type: 		'POST',
                                dataType: 	'json',
                                data: 		{permission: permission , type: type, supervisores: JSON.stringify(array) == "[]" ? 0 :JSON.stringify(array) },
                                success: function( result )
                                {
                                    if( result.result )
                                    {
                                        $('#modal-create').modal('hide');
                                        toastr['success'](result.message, 'Éxito');
                                        setTimeout( function(){ amigable(); }, 500);
                                    }
                                    else
                                    {
                                        toastr['error'](result.message, 'Error');
                                    }
                                },
                                error: 	function( result )
                                {
                                    console.log( result );
                                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                                }
                            });
                        }else{
                            toastr['warning']('En el flujo de aprobación no puede contener dos veses el mismo supervisor', 'Supervisor duplicado');
                        }
                    }else {
                        toastr['warning']('Debe de añadir al supervisor que aprobara el tipo de solicitud', 'Supervisor sin añadir');
                    }
                } else {
                    toastr['warning']('Debe de seleccionar el tipo de especificación de la solicitud', 'Especificación incompleto');
                }
            } else {
                toastr['warning']('Debe de seleccionar un tipo de solicitud', 'Operación incompleto');
            }

        }

    }

    $('#tabla-aprobador').on('click', 'a.btn-edit', function(){
        id = $(this).data('idflujo');
        $('input:checkbox').removeAttr('checked');
        $.ajax({
            url:        'ws/rotulacion/aprobadores/'+id,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    response.records.rotulacion == 1 ? $("#form-edit #retirement-edit").attr('checked', true) : $("#form-edit #manager").attr('checked', false);
                    response.records.rotulacion == 2 ? $("#form-edit #installation-edit").attr('checked', true) : $("#form-edit #manager").attr('checked', false);
                    response.records.rotulacion == 3 ? $("#form-edit #maintenance-edit").attr('checked', true) : $("#form-edit #manager").attr('checked', false);
                    response.records.tipo_rotulacion == 0 ? $("#form-edit #linear-edit").attr('checked', true) : $("#form-edit #manager").attr('checked', false);
                    response.records.tipo_rotulacion == 1 ? $("#form-edit #special-edit").attr('checked', true) : $("#form-edit #manager").attr('checked', false);
                    $('#form-edit #container').parent().empty();
                    cont_edit = 1;
                    $.each(response.records.detail, function (index, value) {
                        var select = '<div class="row" id ="container">' +
                            '<div class="form-group" >' +
                            '<div class="col-md-10">'+
                            '<select class="form-control value-data-edit" id="permisos-edit-'+cont_edit+'">';
                        $.each(type_user, function(index, valor){
                            select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
                        });
                        select += '</select></div>'+
                            '<div class="col-md-2">'+
                            '<a class="btn btn-danger remove"><i class="fa fa-minus-circle"></i></a>'+
                            '</div>'+
                            '</div>'+
                            '<br><br>'+
                            '</div>';
                        $('#input-super-edit').append(select);
                        $("#permisos-edit-"+cont_edit).val(value.id_tipo_supervisor).trigger('change'); cont_edit++;
                    });

                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){})
    });

    $('#btn-add-edit').click(function(e){
        e.preventDefault();
        cont_edit++;
        var select = '<div class="row" id="container">'+
            '<div class="form-group">'+
            '<div class="col-md-10">'+
            '<select class="form-control value-data-edit" id="supervisor-'+cont_edit+'" required>';

            $.each(type_user, function(index, valor){
                select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
            });

        select += '</select></div>'+
            '<div class="col-md-2">'+
            '<a class="btn btn-danger remove"><i class="fa fa-minus-circle"></i></a>'+
            '</div>'+
            '</div>'+
            '<br><br>'+
            '</div>';

        $('#input-super-edit').append(select);
        $('#info-edit').text('Añadir otro superivisor');
    });

    $('#input-super-edit').on("click",".remove", function(e){
        e.preventDefault(); $(this).parent().parent().parent().remove(); cont_edit--;
        cont_edit == 0 ? $('#info-edit').text('Añadir superivisor'): 0 ;
    });

    function update(e) {
        e.preventDefault();
        if( $('#form-edit').valid() )
        {
            var array   = [];
            var selects = $('select.value-data-edit').find('option:selected');
            var proceso = 1;
            selects.each( function(){
                var id      = $(this).val();
                var string  = $(this).text();

                if (id != 0){
                    var object = {};
                    object.id       = id;
                    object.name     = getCleanedString(string);
                    object.proceso  = proceso;
                    array.push(object);
                    proceso++;
                }
            });
            var valueArr = array.map(function(item){ return item.id });
            var isDuplicate = valueArr.some(function(item, idx){return valueArr.indexOf(item) != idx});
            if (array.length > 0) {
                if (!isDuplicate) {
                    $.ajax
                    ({
                        url: 		'ws/rotulacion/aprobadores/'+id,
                        type: 		'PUT',
                        dataType: 	'json',
                        data: 		{supervisores: JSON.stringify(array)},
                        success: function ( result )
                        {
                            if( result.result )
                            {
                                setTimeout( function(){ amigable(); }, 500);
                                toastr['success'](result.message, 'Éxito');
                                $('#modal-edit').modal('hide');
                            }
                            else
                            {
                                toastr['error'](result.message, 'Error');
                            }
                        },
                        error: function ( result )
                        {
                            console.log(result);
                            toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                        }
                    });
                } else {
                    toastr['warning']('En el flujo de aprobación no puede contener dos veses el mismo supervisor', 'Supervisor duplicado');
                }
            } else {
                toastr['warning']('Debe de añadir al supervisor que aprobara el tipo de solicitud', 'Supervisor sin añadir');
            }

        }
    }

    $("#tabla-aprobador").on('click', 'a.btn-remove', function( e ){
        id = $(e.target).closest("a").data("idflujo");
    });

    function remove(e) {
        e.preventDefault();
        $.ajax(
            {
                type:	"DELETE",
                url:	"ws/rotulacion/aprobadores/"+id,
                success: function( result )
                {
                    if( result.result )
                    {
                        toastr['success'](result.message, 'Éxito')
                        setTimeout( function(){ amigable(); }, 500);
                        $("#modal-remove").modal('hide');
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
    }

    function addSuper(e) {
        e.preventDefault();
        cont++;
        var select = '<div class="row" id="container">' +
                         '<div class="form-group">'+
                             '<div class="col-md-10">'+
                                '<select class="form-control value-data" id="supervisor-'+cont+'" required>' +
                                    '<option value="0">Selecione el supervisor</option>';
                                    $.each(type_user, function(index, valor){
                                        select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
                                    });
            select +=           '</select>' +
                             '</div>'+
                            '<div class="col-md-2">'+
                                '<a class="btn btn-danger remove"><i class="fa fa-minus-circle"></i></a>'+
                            '</div>'+
                        '</div><br><br>'+
                    '</div>';
        $('#input-select').append(select);
        $('#info').text('Añadir otro supervisor');
    }

    $('#input-select').on("click",".remove", function(e){
        e.preventDefault(); $(this).parent().parent().parent().remove(); cont--;
        cont == 0 ? $('#info').text('Añadir supervisor'): false;
    });


    $('#tabla-aprobador').on('click', 'a.btn-supervisor', function (e) {
        e.preventDefault();
        id = $(this).data('iduser');
        $.ajax({
            url:        'ws/rotulacion/aprobadores/'+id,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    $('#form-supervisores #container').parent().empty();
                    show = 1;
                    $.each(response.records.detail, function (index, value) {
                        var select = '<div class="row" id="container">' +
                            '<div class="form-group" >' +
                                '<div class="col-md-2">' +
                                    '<label id="circulo">'+show+'</label>' +
                                '</div>'+
                                '<div class="col-md-10">'+
                                    '<select class="form-control" id="permisos-show-'+show+'" disabled>';
                                        $.each(type_user, function(index, valor){
                                            select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
                                        });
                         select += '</select>';
                    select += '</div>'+
                            '</div><br><br>'+
                        '</div>';

                        $('#input-supervisores').append(select);
                        $("#permisos-show-"+show).val(value.id_tipo_supervisor).trigger('change'); show++;
                    });
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){})
    });

    function getCleanedString(cadena){
        var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

        for (var i = 0; i < specialChars.length; i++) {
            cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }

        cadena = $.trim(cadena.toLowerCase());
        cadena = cadena.replace(/ /g,"_");
        cadena = cadena.replace(/á/gi,"a");
        cadena = cadena.replace(/é/gi,"e");
        cadena = cadena.replace(/í/gi,"i");
        cadena = cadena.replace(/ó/gi,"o");
        cadena = cadena.replace(/ú/gi,"u");
        cadena = cadena.replace(/ñ/gi,"n");
        return cadena;
    }



});
