
jQuery(document).ready(function ($) {

    var id = 0;
    var tipos_usuarios;
    var cont = 1;
    var cont_edit = 1;
    var show = 1;

    window.tabla_user = $("#tabla-user").DataTable(
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

    $('#btn-create').on('click', store);
    $('#btn-update').on('click', update);
    $('#btn-remove').on('click', remove);
    $('#btn-new').on('click', clear);

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
                    tipos_usuarios = data.records;
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

    function fillTable() {
        window.tabla_user.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/rotulacion/usuarios',
            type: 		'GET',
            dataType: 	'json'
        })
            .done(function(response){
                if (response.result) {

                    cont = 0; acciones = '';
                    $.each(response.records, function(index, value) {

                        acciones =  '<td>'+
                            '<a class="btn btn-primary btn-xs btn-edit" href="#modal-edit" data-toggle="modal"  data-iduser="'+value.id+'" title="Actualizar usuario"><i class="fa fa-pencil"></i></a>'+
                            '<a class="btn btn-danger btn-xs btn-remove" href="#modal-remove" data-toggle="modal"  data-iduser="'+value.id+'" style="margin-left: 5px;" title="Eliminar usuario"><i class="fa fa-trash"></i></a>'+
                            '<a class="btn btn-info btn-xs btn-permission" href="#modal-permission" data-toggle="modal"  data-iduser="'+value.id+'" style="margin-left: 5px;" title="Detalle de los permisos"><i class="fa fa-list-alt"></i></a>'+
                            '</td>';

                        col1 = ++cont;
                        col2 = value.nombre;
                        col3 = value.email;
                        col4 = value.depto;
                        col5 = value.rotulacion_admin == 1 ? '<span class="label label-success">Si</span>' : '<span class="label label-danger">No</span>';
                        col6 = acciones;
                        window.tabla_user.row.add([col1,col2,col3,col4,col5,col6]).draw(false);
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

    /* ---------------  CREATE USER ----------------------- */

    function store(e) {

        e.preventDefault();
        if( $('#form-create').valid() )
        {
            var array    = [];
            var email    = $('#form-create #email').val();
            var manager  = $('#manager').prop('checked') ? 1 : 0;

            var selects  = $('select.value-data').find('option:selected');

            selects.each( function(){
                var id     = $(this).val();
                var string = $(this).text();
                if (id != "" && id != 0){
                    var object = {};
                    object.id    = id;
                    object.name  = getCleanedString(string);
                    object.value = 1;
                    array.push(object);
                }
            });
            // Validacion de duplicados
            var valueArr = array.map(function(item){ return item.id });
            var isDuplicate = valueArr.some(function(item, idx){return valueArr.indexOf(item) != idx});
            if (!isDuplicate) {
                if ($('#manager').prop('checked') || array.length > 0){
                    $.ajax({
                        url: 		'ws/rotulacion/usuarios',
                        type: 		'POST',
                        dataType: 	'json',
                        data: 		{ email: email , manager: manager , supervisor: JSON.stringify(array) == "[]" ? 0 :JSON.stringify(array) },
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
                                console.error(result.message);
                                toastr['error'](result.message, 'Error');
                            }
                        },
                        error: 	function( result )
                        {
                            console.log( result );
                            toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                        }
                    });
                } else {
                    toastr['warning']('Debe de seleccionar uno de los dos roles', 'Roles duplicados');
                }
            } else {
                toastr['warning']('No puede duplicar los roles para un mismo usuario', 'Roles duplicados');
            }
        }
    }

    $('#btn-add').click(function(e){
        e.preventDefault();
        var select = '<div class="row" id="container">' +
            '<div class="form-group">'+
            '<div class="col-md-10">'+
            '<select class="form-control value-data" id="permisos-'+cont+'" data-placeholder="Seleccione el supervisor" required>';

            $.each(tipos_usuarios, function(index, valor){
                select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
            });

            select += '</select></div>'+
                '<div class="col-md-2">'+
                '<a class="btn btn-danger remove"><i class="fa fa-minus-circle"></i></a>'+
                '</div>'+
                '</div>'+
                '<br><br>'+
                '</div>';

        $('#input-select').append(select);
        cont++;
    });

    $('#input-select').on("click",".remove", function(e){
        e.preventDefault(); $(this).parent().parent().parent().remove(); cont--;
    });

    /* ---------------  UPDATE USER ----------------------- */

    $('#tabla-user').on('click', 'a.btn-edit', function(){
        id = $(this).data('iduser');
        $.ajax({
            url:        'ws/rotulacion/usuarios/'+id,
            type:       'GET',
            dataType:   'json'
        })
        .done(function(response){
            if (response.result) {
                $('#form-edit #name').val(response.records.nombre);
                $('#form-edit #email-edit').val(response.records.email);
                response.records.rotulacion_admin == 1 ? $("#form-edit #manager").attr('checked', true) : $("#form-edit #manager").attr('checked', false);
                $('#form-edit #container').parent().empty();
                cont_edit = 1;
                $.each(JSON.parse(response.records.rotulacion_supervisor), function (index, value) {
                    var select = '<div class="row" id ="container">' +
                        '<div class="form-group" > '+
                        '<div class="col-md-10">'+
                        '<select class="form-control value-data-edit" id="permisos-edit-'+cont_edit+'" data-placeholder="Seleccione los supervisor" required>';
                        $.each(tipos_usuarios, function(index, valor){
                            select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
                        });
                    select += '</select></div>'+
                        '<div class="col-md-2">'+
                        '<a class="btn btn-danger remove-edit"><i class="fa fa-minus-circle"></i></a>'+
                        '</div><br><br>'+
                        '</div>' +
                        '</div>';

                    $('#input-select-edit').append(select); // Llena la select
                   $("#permisos-edit-"+cont_edit).val(value.id).trigger('change'); // Da el valor que le corresponde.

                    cont_edit++;
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
        var select = '<div class="row" id="container">' +
            '<div class="form-group">'+
            '<div class="col-md-10">'+
            '<select class="form-control value-data-edit" id="permisos-'+cont_edit+'" data-placeholder="Seleccione el supervisor" required>';

        $.each(tipos_usuarios, function(index, valor){
            select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
        });

        select += '</select></div>'+
            '<div class="col-md-2">'+
            '<a class="btn btn-danger remove-edit"><i class="fa fa-minus-circle"></i></a>'+
            '</div>'+
            '</div>'+
            '<br><br>'+
            '</div>';

        $('#input-select-edit').append(select);
        cont_edit++;
    });

    $('#input-select-edit').on("click",".remove-edit", function(e){
        e.preventDefault(); $(this).parent().parent().parent().remove(); cont--;
    });

    function update(e) {
        e.preventDefault();
        if( $('#form-edit').valid() )
        {
            var array    = [];
            var email    = $('#form-edit #email').val();
            var manager  = $('#form-edit #manager').prop('checked') ? 1 : 0;
            var selects  = $('select.value-data-edit').find('option:selected');

            selects.each( function(){
                var id     = $(this).val();
                var string = $(this).text();
                if (id != "" && id != 0){
                    var object = {};
                    object.id    = id;
                    object.name  = getCleanedString(string);
                    object.value = 1;
                    array.push(object);
                }
            });
            // Validacion de duplicados
            var valueArr = array.map(function(item){ return item.id });
            var isDuplicate = valueArr.some(function(item, idx){return valueArr.indexOf(item) != idx});
            if (!isDuplicate) {
                $.ajax
                ({
                    type: 		'PUT',
                    url: 		'ws/rotulacion/usuarios/'+id,
                    dataType: 	'json',
                    data: 		{ email: email , manager: manager , supervisor: JSON.stringify(array) == "[]" ? 0 :JSON.stringify(array) },
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
                toastr['warning']('No puede duplicar los roles para un mismo usuario', 'Roles duplicados');
            }
        }
    }

    /* ------------ SHOW DETAIL OF PERMITS -------------- */

    $('#tabla-user').on('click', 'a.btn-permission', function (e) {
        e.preventDefault();
        id = $(this).data('iduser');
        $.ajax({
            url:        'ws/rotulacion/usuarios/'+id,
            type:       'GET',
            dataType:   'json'
        })
        .done(function(response){
            if (response.result) {
                $('#form-permission #container').parent().empty();
                show = 1;
                $.each(JSON.parse(response.records.rotulacion_supervisor), function (index, value) {
                    var select = '<div class="row" id ="container">' +
                        '<div class="form-group" > '+
                            '<div class="col-md-12">'+
                                '<select class="form-control" id="permisos-show-'+show+'" disabled>';
                                    $.each(tipos_usuarios, function(index, valor){
                                        select += '<option value="'+valor.id+'">'+valor.nombre+'</option>';
                                    });
                    select +=   '</select>' +
                            '</div>'+
                        '</div><br><br>'+
                        '</div>';
                    $('#input-permission').append(select); $("#permisos-show-"+show).val(value.id).trigger('change'); show++;
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

    /* ------------------ DELETE USER  -------------------- */

    $("#tabla-user").on('click', 'a.btn-remove', function( e ){
        id = $(e.target).closest("a").data("iduser");
    });

    function remove(e) {
        e.preventDefault();
        $.ajax(
            {
                type:	"DELETE",
                url:	"ws/rotulacion/usuarios/"+id,
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

    /* ---------------- EXTRAS FUNCTIONS ---------------- */

    function clear(){
        fillTypeUser();
        $('#form-create')[0].reset();
        $("#form-create").validate().resetForm();
        $('#form-create #email').removeClass('valid');
        $('#form-create #email').removeClass('error');
        $('#form-edit #email-edit').removeClass('valid');
        $('#form-edit #email-edit').removeClass('error');
        $('#form-create #container').parent().empty();
        cont      = 1;
        cont_edit = 1;
    }

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
