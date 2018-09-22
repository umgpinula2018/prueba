jQuery(document).ready(function ($) {

    var json_text   = "";
    var json_editar = "";
    var record_id = 0;
    if($.fn.DataTable) {
        window.tabla_registros = $("#records-table").DataTable({
            'oLanguage': {
                'sLengthMenu':     'Mostrando _MENU_ filas',
                'sSearch':         '',
                'sProcessing':     'Procesando...',
                'sLengthMenu':     'Mostrar _MENU_ registros',
                'sZeroRecords':    'No se encontraron resultados',
                'sEmptyTable':     'Ningún dato disponible en esta tabla',
                'sInfo':           'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                'sInfoEmpty':      'Mostrando registros del 0 al 0 de un total de 0 registros',
                'sInfoFiltered':   '(filtrado de un total de _MAX_ registros)',
                'sInfoPostFix':    '',
                'sSearch':         'Buscar:',
                'sUrl':            '',
                'sInfoThousands':  '',
                'sLoadingRecords': 'Cargando...',
                'oPaginate': {
                    'sFirst':      'Primero',
                    'sLast':       'Último',
                    'sNext':       'Siguiente',
                    'sPrevious':   'Anterior'
                }
            },
            deferRender: true,
            processing: true,
            ajax: {
                url: 'ws/medidas/generales',
                type: 'GET',
                data: {
                    PAIS: localStorage.PAIS
                }
            },
            'columns': [
                {data: 'DT_Row_Index', name: 'DT_Row_Index',},
                {data: 'descripcion', name: 'descripcion'},
                {data: 'pais', name: 'pais'},
                {data: 'acciones', name: 'acciones'}
            ],
            'columnDefs': {
                'searchable': false,
                'targets': [0] 
            },
            'initComplete': function () {
                $('#loader').fadeOut();
            }
        });
    }
    else {
        $.when(
            $.getScript('js/jquery.dataTables.js'),
            $.Deferred(function (deferred) {
                $(deferred.resolve);
            })
        ).done(function () {
            window.tabla_registros = jQuery("#records-table").DataTable({
                'oLanguage': {
                    'sLengthMenu':     'Mostrando _MENU_ filas',
                    'sSearch':         '',
                    'sProcessing':     'Procesando...',
                    'sLengthMenu':     'Mostrar _MENU_ registros',
                    'sZeroRecords':    'No se encontraron resultados',
                    'sEmptyTable':     'Ningún dato disponible en esta tabla',
                    'sInfo':           'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                    'sInfoEmpty':      'Mostrando registros del 0 al 0 de un total de 0 registros',
                    'sInfoFiltered':   '(filtrado de un total de _MAX_ registros)',
                    'sInfoPostFix':    '',
                    'sSearch':         'Buscar:',
                    'sUrl':            '',
                    'sInfoThousands':  '',
                    'sLoadingRecords': 'Cargando...',
                    'oPaginate': {
                        'sFirst':      'Primero',
                        'sLast':       'Último',
                        'sNext':       'Siguiente',
                        'sPrevious':   'Anterior'
                    }
                },
                'order': [[0, 'asc']],
                'deferRender': true,
                'processing': true,
                ajax: {
                    url: 'ws/medidas/generales',
                    type: 'GET',
                    data: {
                        PAIS: localStorage.PAIS
                    }
                },
                'columns': [
                    {data: 'DT_Row_Index', name: 'DT_Row_Index',},
                    {data: 'descripcion', name: 'descripcion'},
                    {data: 'pais', name: 'pais'},
                    {data: 'acciones', name: 'acciones'}
                ],
                'columnDefs': {
                    'searchable': false,
                    'targets': [0] 
                },
                'initComplete': function () {
                    $('#loader').fadeOut();
                }
            });
        });
    }

    clearInputs();
    showListCountry();
    $('#records-table').on('click', 'a.btn-show', showRecord);
    $('#records-table').on('click', 'a.btn-delete', showDeleteRecord);
    $('#records-table').on('click', 'a.formulario',function(){

        $("#form-modal").modal();
        id = $(this).data('id');
        
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/faltas/generales/'+id,
            dataType: 'json'
        }).done(function (response) {
            $('.frmb').append(response.records.formulario_editar);
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        });

        $('.form-field').remove();
        $('.clear-all').prop('id','btn-cerrar');
        $('#btn-cerrar').on('click',function(){
            $('#form-modal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });
        $('.clear-all').text("Cerrar");
        $('.btn-default').hide();
    });

    $('#form-modal').on('click','button.save-template', function(){
        $('.render-wrap').hide();
        json_text   = $('.render-wrap').html();
        json_editar = $('.frmb').html();
        $.ajax({
            type:   'POST',
            url:    'ws/medidas/faltas/generales/formulario',
            dataType: 'json',
            data:  {json_text: json_text,id:id,json_editar:json_editar}
        }).done(function (response) {
            toastr['success'](response.message, 'Exito');
            $("#form-modal").modal('hide');
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {
            $('#loader').fadeOut();
        });
    });
    
    $('#btn-store').on('click', storeRecord);
    $('#btn-edit').on('click', updateRecord);
    $('#btn-delete').on('click', deleteRecord);
    $('#new-record').on('click', (e)=>{
        e.preventDefault();
        $("#store-modal").modal();
    });

    function loadTable() {
        $('#loader').show();
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/faltas/generales',
            dataType: 'json'
        }).done(function (response) {
            try {
                window.tabla_registros.clear().draw();
                var contador = 1;
                $.each(response.records, function (index, value) {
                    col1 = contador;
                    col2 = value.descripcion;
                    col3 = value.pais_txt;
                    col4 = '<center><a href="" class="btn btn-xs btn-primary btn-show" data-toggle="modal" data-id="'+value.id+'"><i class="glyphicon glyphicon-edit"></i> Editar</a>'+
                     '<a style="margin-left:10px" href="" class="btn btn-xs btn-success formulario" data-toggle="modal" data-id="'+value.id+'"><i class="glyphicon glyphicon-list"></i> Formulario</a>'+
                            '<a href="" class="btn btn-xs btn-danger btn-delete"  data-toggle="modal" data-id="'+value.id+'" style="margin-left: 1%"><i class="glyphicon glyphicon-trash"></i> Eliminar</a>';

                    window.tabla_registros.row.add({
                        DT_Row_Index: col1,
                        descripcion: col2,
                        pais: col3,
                        acciones: col4
                    }).draw(false);
                    contador += 1;
                });
            } catch(e) {
                $('#loader').fadeOut();
            }
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {
            $('#loader').fadeOut();
        });
    }

    function showListCountry() {
       
       var country;

        switch(localStorage.PAIS) {
            case "CR": 
                country = '<option value="CR">Costa Rica</option>';
                break;
            case "GT":
                country = '<option value="GT">Guatemala</option>';
                break;
            case "USA":
                country = '<option value="USA">Estados Unidos</option>';
                break;
        }

        $("#store-form #pais, #edit-form #pais").html(country);

    }

    function storeRecord (event) {
        event.preventDefault();
        data = {
            descripcion: $('#store-form #descripcion').val().trim(),
            pais: $('#store-form #pais').val(),
            pais_txt: $("#store-form #pais option:selected").text()
        };

        if(data.descripcion.length == 0) {
            return toastr.warning('No puedes dejar el campo descripción vacío');
        }

        $.ajax({
            type:       'POST',
            url:        'ws/medidas/faltas/generales',
            dataType:   'json',
            data:       data
        }).done( (response)=>{
            
            $('#store-modal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();            
            loadTable();
            clearInputs();
            toastr['success'](response.message, 'Éxito');

        }).fail(function (response) {
        
            toastr['error'](response.message, 'Error');
        
        });
    }

    function showRecord (event) {
        event.preventDefault();
        $("#edit-modal").modal();
        record_id = $(this).data('id');
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/faltas/generales/'+record_id,
            dataType: 'json'
        }).done(function (response) {
            $('#edit-form #descripcion').val(response.records.descripcion);
            $('#edit-form #pais').val(response.records.pais);
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        });
    }

    function updateRecord (event) {
        event.preventDefault();
        var $this = $(this);
        data = {
            descripcion: $('#edit-form #descripcion').val(),
            pais: $('#edit-form #pais').val(),
            pais_txt: $("#edit-form #pais option:selected").text()
        };

        $.ajax({
            type:   'PUT',
            url:    'ws/medidas/faltas/generales/'+record_id,
            dataType: 'json',
            data:   data
        }).done(function (response) {
            
            loadTable();
            
            $('#edit-modal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

            toastr['success'](response.message, 'Éxito');
            clearInputs();
            
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        });
    }

    function showDeleteRecord (event) {
        event.preventDefault();

        $("#delete-modal").modal();
        record_id = $(this).data('id');
 
    }

    function deleteRecord (event) {
        event.preventDefault();
        $.ajax({
            type:   'DELETE',
            url:    'ws/medidas/faltas/generales/'+record_id,
            dataType: 'json'
        }).done(function (response) {
            loadTable();
            $('#delete-modal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            toastr['success'](response.message, 'Éxito');
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        })
    }

    function clearInputs () {
        $('#store-form')[0].reset();
        $('#edit-form')[0].reset();
    }
});