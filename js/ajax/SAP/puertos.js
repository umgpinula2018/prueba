jQuery( document ).ready( function( $ )
{
    
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

    llenarTabla();
    var idregistro = 0;
    var ideliminar = 0;

    //------------- Llena la tabla de registros ---------------
    function llenarTabla()
    {        
        window.tablaAreas.clear().draw();
        $('#loader').show();
        $.ajax(
        {
            url:        'ws/SAP/archivos',
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
            if( data.result ){
                cont = 0;
                $.each( data.records, function( index,value ){
                    if(value.puerto >0){
                        Col1 = ++cont;
                        Col2 = value.archivo;
                        Col3 = value.puerto;                
                        Col4 = value.funcion;
                        Col5 = '<td>'+
                                        '<a style="margin-left: 5px;" class="btn btn-info btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal" data-idregistro="'+value.id+'"><i class="fa fa-eye"></i></a>'+
                                        ' <a class="btn-editar btn btn-primary btn-xs" href="#modal-editar" data-toggle="modal" data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
                                    '</td>';
                        window.tablaAreas.row.add([Col1,Col2,Col3,Col4,Col5]).draw(false);
                    }
                       
                });

                //Estilos
                $('.enabled').css( 'cursor', 'pointer' );
                $('.disabled').css( 'cursor', 'pointer' );
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log(err);
        })  
        .always( function()
        {
            $("#loader").fadeOut();
        });     
    }

    //------------- Crear registro ---------------
    // $('#btn-crear').on('click', function( e )
    // {
    //     e.preventDefault();
    //     $.ajax(
    //     {
    //         type:       'POST',
    //         url:        'ws/aplicaciones',
    //         dataType:   'json',
    //         data:       $('#form-crear').serialize()
    //     })
    //     .done(function(data)
    //     {
    //         if( data.result )   
    //         {
    //             $('#modal-crear').modal('hide'); 
    //             toastr['success'](data.message, 'Éxito')
    //             setTimeout( function(){ amigable(); }, 500);                        
    //         }
    //         else
    //             toastr['error'](data.message, 'Error');
    //     })
    //     .fail(function(err)
    //     {
    //         console.log( err );
    //     })  
    //     .always( function()
    //     {
    //         console.log('Completo');
    //     });  
    // });

    //------------- Cargar la información del registro seleccionado ---------------
    // $('#tabla-registros').on('click', 'a.btn-editar', function( e )
    // {
    //     e.preventDefault();
    //     idregistro = $(this).data('idregistro');

    //     $.ajax(
    //     {
    //         url:        'ws/aplicaciones/'+idregistro,
    //         type:       'GET',
    //         dataType:   'json',
    //     })
    //     .done(function(data)
    //     {
    //         if( data.result )   
    //         {
    //             $('#edit_nombre').val( data.records.nombre );
    //             $('#edit_descripcion').val( data.records.descripcion );
    //             data.records.visible == 1 ? $('#edit_visible').prop('checked', true) : $('#edit_visible').prop('checked', false);
    //         }
    //         else
    //             toastr['error'](data.message, 'Error');
    //     })
    //     .fail(function(err)
    //     {
    //         console.log( err );
    //     })  
    //     .always( function()
    //     {
    //         console.log('Completo');
    //     });  
    // });

    //------------- Editar registro ---------------
    // $('#btn-actualizar').on('click', function( e )
    // {
    //     e.preventDefault();
    //     $.ajax(
    //     {
    //         type:       'PUT',
    //         url:        'ws/aplicaciones/'+idregistro,
    //         dataType:   'json',
    //         data:       $('#form-editar').serialize()
    //     })
    //     .done(function(data)
    //     {
    //         if( data.result )   
    //         {
    //             $('#modal-editar').modal('hide'); 
    //             toastr['success'](data.message, 'Éxito')
    //             setTimeout( function(){ amigable(); }, 500);                        
    //         }
    //         else
    //             toastr['error'](data.message, 'Error');
    //     })
    //     .fail(function(err)
    //     {
    //         console.log( err );
    //     })  
    //     .always( function()
    //     {
    //         console.log('Completo');
    //     });  
    // });

    //------------- Cargar la información del registro seleccionado ---------------
    // $('#tabla-registros').on('click', 'a.btn-eliminar', function( e )
    // {
    //     e.preventDefault();
    //     ideliminar = $(this).data('idregistro');
    // });

    //------------- Eliminar registro ---------------
    // $('#btn-eliminar').on('click', function( e )
    // {
    //     e.preventDefault();
    //     $.ajax(
    //     {
    //         type:       'DELETE',
    //         url:        'ws/aplicaciones/'+ideliminar,
    //         dataType:   'json'
    //     })
    //     .done(function(data)
    //     {
    //         if( data.result )   
    //         {
    //             $('#modal-eliminar').modal('hide'); 
    //             toastr['success'](data.message, 'Éxito')
    //             setTimeout( function(){ amigable(); }, 500);                        
    //         }
    //         else
    //             toastr['error'](data.message, 'Error');
    //     })
    //     .fail(function(err)
    //     {
    //         console.log( err );
    //     })  
    //     .always( function()
    //     {
    //         console.log('Completo');
    //     });  
    // });
});