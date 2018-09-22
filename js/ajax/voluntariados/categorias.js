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

    // ------------- Limpia el Formulario Crear ---------------
    function limpiar (){
        $('#form-crear')[0].reset();
        $('#form-crear').validate().resetForm();
        $('#nombre_categoria').removeClass('valid');
        $('#nombre_categoria').removeClass('error');
    }
    $('#crearRegistro').on('click',function(){
       limpiar();
    });

    //------------- Llena la tabla de registros ---------------
    function llenarTabla()
    {        
        window.tablaAreas.clear().draw();
        $('#loader').show();
        $.ajax(
        {
            url:        'ws/voluntariados/categorias/listar',
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data)
        { 
            if( data.result )
            {
                cont = 0;
                $.each( data.records, function( index,value )
                {
                    var visible_option='';
                    var color='';
                    var modal='';
                    counter1 = ++cont;
                    counter2 = value.nombre;
                    if( value.visible== 1 )
                    {
                        visible_option='fa-minus-square ';
                        color='danger ';
                        modal='inactivo ';
                        counter3 = '<a data-placement="top" title="Activo" class="toltip btn-aprobar btn btn-success btn-xs" href="#modal-desactivar" data-toggle="modal" ><i class="fa fa-check"></i> Activo</a>';                
                    }
                    else
                    {
                        visible_option='fa-plus-square ';
                        color='success ';
                        modal='activo';
                        counter3 = '<a data-placement="top" title="Inactivo" class="toltip btn-aprobar btn btn-warning btn-xs" href="#modal-activar" data-toggle="modal" ><i class="fa fa-close"></i> Inactivo</a>';                
                    }

                    counter4 = '<td>'+
                                    '<a class="btn-editar btn btn-primary btn-xs" href="#modal-editar" data-toggle="modal" data-idregistro="'+value.id+'"> <i class="fa fa-pencil"></i></a> '+
                                    '<a style="margin-left: 5px;" class="btn btn-'+color+' btn-xs btn-eliminar" href="#modal-'+modal+'" data-toggle="modal" data-idregistro="'+value.id+'"> <i class="fa '+visible_option+' "></i></a>'+
                                '</td>';
                    window.tablaAreas.row.add([counter1,counter2,counter3,counter4]).draw(false);
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
    $('#btn-crear').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'POST',
            url:        'ws/voluntariados/categorias/listar',
            dataType:   'json',
            data:       $('#form-crear').serialize()
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#modal-crear').modal('hide'); 
                toastr['success'](data.message, 'Éxito')
                setTimeout( function(){ amigable(); }, 500);                        
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });  
    });

    //------------- Cargar la información del registro seleccionado ---------------
    $('#tabla-registros').on('click', 'a.btn-editar', function( e )
    {
        e.preventDefault();
        idregistro = $(this).data('idregistro');

        $.ajax(
        {
            url:        'ws/voluntariados/categorias/listar/'+idregistro,
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#edit_nombre').val( data.records.nombre );
                $('#edit_visible').val( data.records.visible );
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });  
    });

    //------------- Editar registro ---------------
    $('#btn-actualizar').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'PUT',
            url:        'ws/voluntariados/categorias/listar/'+idregistro,
            dataType:   'json',
            data:       $('#form-editar').serialize()
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#modal-editar').modal('hide'); 
                toastr['success'](data.message, 'Éxito')
                setTimeout( function(){ amigable(); }, 500);                        
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });  
    });

    //------------- Cargar la información del registro seleccionado ---------------
    $('#tabla-registros').on('click', 'a.btn-eliminar', function( e )
    {
        e.preventDefault();
        ideliminar = $(this).data('idregistro');
    });

    //------------- Eliminar registro ---------------
    $('#btn-activo').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'DELETE',
            url:        'ws/voluntariados/categorias/listar/'+ideliminar,
            dataType:   'json',
            data:       'visible='+$('#activo').val(),
        })
        .done(function(data)
        {
            console.log( data );
            if( data.result )   
            {
                $('#modal-activo').modal('hide'); 
                toastr['success'](data.message, 'Éxito')
                setTimeout( function(){ amigable(); }, 500);                        
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });  
    });

        $('#btn-inactivo').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'DELETE',
            url:        'ws/voluntariados/categorias/listar/'+ideliminar,
            dataType:   'json',
            data:       'visible='+$('#inactivo').val(),
        })
        .done(function(data)
        {
            console.log( data );
            if( data.result )   
            {
                $('#modal-inactivo').modal('hide'); 
                toastr['success'](data.message, 'Éxito')
                setTimeout( function(){ amigable(); }, 500);                        
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });  
    });
});