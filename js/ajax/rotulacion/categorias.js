jQuery(document).ready(function($) {

    var id         = 0;
    var delete_id  = 0;
    var detail     = [];
    
    window.tabla_categorias = $("#tabla-category").DataTable(
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

    $('#btn-new').on('click', clear);
    $('#btn-crear').on('click', store);
    $('#btn-modificar').on('click', update);
    $('#btn-eliminar').on('click', destroy);

    function fillTable(){
        window.tabla_categorias.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/rotulacion/categorias',
            type: 		'GET',
            dataType: 	'json'
        })
            .done(function(response){
                if (response.result) {
                    cont = 0; acciones = '';
                    $.each(response.records, function(index, value) {

                        acciones =  '<td>'+
                            '<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idcategory="'+value.id+'" title="Actualizar categoría"><i class="fa fa-pencil"></i></a>'+
                            '<a class="btn btn-danger btn-xs btn-eliminar" style="margin:3px;" href="#modal-eliminar" data-toggle="modal"  data-idcategory="'+value.id+'" title="Eliminar categoría"><i class="fa fa-trash"></i></a>'+
                            '</td>';

                        col1 = ++cont;
                        col2 = value.descripcion;
                        col3 = acciones;
                        window.tabla_categorias.row.add([col1,col2,col3]).draw(false);
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
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();
        $('#form-crear #container').parent().empty();
        $('#description').removeClass('valid');
        $('#description').removeClass('error');
    }

    $('#btn-add').click(function(e){
        e.preventDefault();
        $('#input-wrap').append('<div class="row" id="container">' +
                                '<div class="form-group">'+
                                    '<div class="col-md-10">'+
                                        '<input type="text" class="form-control detail" name="detail" id="detail" placeholder="Detalle" required/>'+
                                    '</div>'+
                                    '<div class="col-md-2">'+
                                        '<a class="btn btn-danger remove"><i class="fa fa-minus-circle"></i></a>'+
                                    '</div>'+
                                '</div>'+
                                '<br><br>'+
                           '</div>'
                          );
    });
    $('#input-wrap').on("click",".remove", function(e){
        e.preventDefault(); $(this).parent().parent().parent().remove();
    });

    function store(e) {
        e.preventDefault();
        if ($('#form-crear').valid()) {
            $('.detail').each( function(){
                var string = $(this).val();
                if (string){
                    var object = {};
                    object.label = $.trim(string);
                    object.name  = getCleanedString(string);
                    object.value = 0;
                    detail.push(object);
                }
            });
            $('#loader').show();
            $.ajax({
                url:        'ws/rotulacion/categorias',
                type:       'POST',
                dataType:   'json',
                data:       { description: $('#description').val(), detail: JSON.stringify(detail) }
            })
                .done(function(response){
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        detail = [];
                        $("#modal-crear").modal('hide');
                        fillTable();
                    } else {
                        detail = [];
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function(response){
                    detail = [];
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){ $('#loader').fadeOut(); })
        }
    }

    $('#tabla-category').on('click', 'a.btn-editar', function(){
        id = $(this).data('idcategory');
        $.ajax({
            url:        'ws/rotulacion/categorias/'+id,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    $('#form-editar #edit-description').val(response.records.descripcion);
                    $('#form-editar #container').parent().empty();
                    $.each(JSON.parse(response.records.detalle), function (index, value) {
                        $('#input-wrap-edit').append('<div class="row" id ="container">' +
                            '<div class="form-group" > '+
                                '<div class="col-md-10">'+
                                    '<input type="text" class="form-control update-detail" value="'+value.label+'">'+
                                '</div>' +
                                '<div class="col-md-2">'+
                                    '<a class="btn btn-danger remove-edit"><i class="fa fa-minus-circle"></i></a>'+
                                '</div><br><br>'+
                            '</div>' +
                            '</div>');
                    })
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
        $('#input-wrap-edit').append('<div class="row" id="container">'+
                '<div class="form-group">'+
                    '<div class="col-md-10">'+
                        '<input type="text" class="form-control update-detail"  placeholder="Detalle" required/>'+
                    '</div>'+
                    '<div class="col-md-2">'+
                        '<a class="btn btn-danger remove-edit"><i class="fa fa-minus-circle"></i></a>'+
                    '</div>'+
                '</div>'+
                '<br><br>'+
            '</div>'
        );
    });
    $('#input-wrap-edit').on("click",".remove-edit", function(e){
        e.preventDefault(); $(this).parent().parent().parent().remove();
    });

    function update(e) {
        e.preventDefault();
        if ($('#form-editar').valid()) {
            $('.update-detail').each( function(){
                var string = $(this).val();
                if (string != ""){
                    var object = {};
                    object.label = $.trim(string);
                    object.name  = getCleanedString(string);
                    object.value = 0;
                    detail.push(object);
                }
            });
            $.ajax({
                url:        'ws/rotulacion/categorias/'+id,
                type:       'PUT',
                dataType:   'json',
                data:       { description: $('#edit-description').val(), detail: JSON.stringify(detail) }
            })
                .done(function(response){
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        detail = [];
                        $("#modal-editar").modal('hide');
                        fillTable();
                    } else {
                        detail = [];
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function(response){
                    detail = [];
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){ $('#loader').fadeOut(); })
        }
    }

    $('#tabla-category').on('click', 'a.btn-eliminar', function(){
        delete_id = $(this).data('idcategory');
    });

    function destroy(e){
        e.preventDefault();
        $.ajax({
            url:        'ws/rotulacion/categorias/'+delete_id,
            type:       'DELETE',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    toastr['success'](response.message, 'Éxito');
                    $("#modal-eliminar").modal('hide');
                    fillTable();
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); })
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
