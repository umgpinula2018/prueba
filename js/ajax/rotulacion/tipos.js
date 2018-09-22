jQuery(document).ready(function ($) {

    var id = 0;
    window.tabla_type = $("#tabla-type").DataTable(
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
    $('#btn-modificar').on('click', update);

    function fillTable(){
        window.tabla_type.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/rotulacion/tipos/solicitudes',
            type: 		'GET',
            dataType: 	'json'
        })
            .done(function(response){
                if (response.result) {
                    cont = 0; acciones = '';
                    $.each(response.records, function(index, value) {

                        acciones =  '<td>' +
                                        '<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idtype="'+value.id+'" title="Actualizar lista de chequeo"><i class="fa fa-pencil"></i></a>'+
                                    '</td>';

                        col1 = ++cont;
                        col2 = value.descripcion;
                        col3 = acciones;
                        window.tabla_type.row.add([col1,col2,col3]).draw(false);
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


    $('#btn-add-edit').click(function(e){
        e.preventDefault();
        $('#input-wrap-edit').append('<div class="row">' +
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
        e.preventDefault(); $(this).parent().parent().parent().remove();;
    });

    $('#tabla-type').on('click', 'a.btn-editar', function(){
        id = $(this).data('idtype');
        $.ajax({
            url:        'ws/rotulacion/tipos/solicitudes/'+id,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    $('#form-editar #edit-description').val(response.records.descripcion);
                    $('#form-editar #container').parent().empty();
                    $.each(JSON.parse(response.records.formulario), function (index, value) {
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

    function update(e) {
        e.preventDefault();
        var detail = [];
        $('.update-detail').each( function(){
            var string = $(this).val();
            if (string != "" ){
                var object = {};
                object.label = $.trim(string);
                object.name  = getCleanedString(string);
                object.value = 0;
                detail.push(object);
            }
        });

        if ($('#form-editar').valid()) {
            $('#loader').show();
            $.ajax({
                url:        'ws/rotulacion/tipos/solicitudes/'+id,
                type:       'PUT',
                dataType:   'json',
                data:       { form: JSON.stringify(detail) }
            })
                .done(function(response){
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        $("#modal-editar").modal('hide');
                        $('#form-editar #container').parent().empty();
                        detail = [];
                    } else {
                        toastr['error'](response.message, 'Error');
                        detail = [];
                    }
                })
                .fail(function(response){
                    toastr['error'](response.message, 'Error');
                    detail = [];
                })
                .always(function(){ $('#loader').fadeOut(); })
        }
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
