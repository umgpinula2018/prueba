jQuery(document).ready(function($){
    var idregistro = 0;

    window.tablaServicioRequerido = $("#tabla-registros").DataTable(
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

    //------------------------------------------------------------------ EVENTOS --------------------------------------------------------------------

    $('#btn-nuevo').on('click',function(){ restaurar(); });
    $('#btn-crear').on('click', store);
    $('#btn-editar').on('click', update);
    $('#btn-eliminar').on('click', destroy);

    //----------------------------------------------------- FUNCION PARA LLENAR TABLA INICIAL -------------------------------------------------------
   
    function llenarTabla(){
        $("#loader").show();
        window.tablaServicioRequerido.clear().draw();

        $.ajax({
            url:        'ws/compras/serviciorequerido',
            type:       'GET',
            dataType:   'json'
            }
        )
        .done(function(data){       
            if( data.result ){  
                contador = 0;       
                $.each(data.records, function(index,value){
                    contador++;
                    counter1 = contador;
                    counter2 = value.servicio_requerido;
                    counter3 = '<a class="btn-editar btn btn-info btn-xs" href="#modal-editar" title="Editar" data-toggle="modal" data-ideditar="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
                               '<a class="btn-eliminar btn btn-danger btn-xs" href="#modal-eliminar" title="Eliminar" data-toggle="modal" data-ideliminar="'+value.id+'" style="margin:3px;"><i class="fa fa-trash"></i></a>';
                    


                    window.tablaServicioRequerido.row.add([counter1,counter2,counter3]).draw(false);
                });
            }
        })
        .fail(function(err){
            console.log(err);
        })
        .always( function(){
            $("#loader").fadeOut();
        });     
    }

    //------------------------------------------------- FUNCION PARA LLENAR CAMPOS DE EDICIÓN -------------------------------------------------

    $("#tabla-registros").on('click','.btn-editar', function( e )
    {
        restaurar();

        e.preventDefault();                     
        idregistro = $(e.target).closest("a").data("ideditar");
        
        $.ajax({
            type: "GET",
            url : "ws/compras/serviciorequerido/"+idregistro,
            success : function( result )
            {               
                if( result.result )
                {
                    $("#form-editar #servicio_requerido").val(result.records.servicio_requerido);                 
                }
                else
                {
                    toastr['error'](result.message, 'Error');
                    $("#modal-editar").modal('hide'); 
                }      
              
            },
            error: function( data )
            {
                toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
            }
        });
    });

    //------------------------------------------------- FUNCION PARA LLENAR VARIABLE DE ELIMINACION ----------------------------------------------

    $("#tabla-registros").on('click', '.btn-eliminar', function( e ){
        idregistro = $(e.target).closest("a").data("ideliminar");
    });

    //---------------------------------------------------------- FUNCION PARA CREAR --------------------------------------------------------------
    
    function store( e )
    {
        e.preventDefault();
        if( $( '#form-crear' ).valid() )
        {       
                $.ajax(
                {
                    type:       'POST',
                    url:        'ws/compras/serviciorequerido',
                    dataType:   'json',
                    data:       $('#form-crear').serialize(),
                    success: function( result )
                        {
                            if( result.result )
                            {
                                $('#modal-crear').modal('hide');
                                toastr['success'](result.message, 'Éxito');
                                setTimeout( function(){ amigable(); }, 500);  
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

    //---------------------------------------------------------- FUNCION PARA EDITAR --------------------------------------------------------------

    function update( e )
    {
        e.preventDefault();
        if( $('#form-editar').valid() )
        {
            $.ajax
            ({
                type:       'PUT',
                url:        'ws/compras/serviciorequerido/'+idregistro,
                dataType:   'json',
                data:       $('#form-editar').serialize(),
                success: function ( result )
                {
                    if( result.result )
                    {
                        setTimeout( function(){ amigable(); }, 500);                        
                        toastr['success'](result.message, 'Éxito')
                        $('#modal-editar').modal('hide'); 
                    }
                    else
                    {
                        toastr['error'](result.message, 'Error');
                    }
                },
                error: function ( result )
                {
                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                }
            });
        }
    }

    //---------------------------------------------------------- FUNCION PARA ELIMINAR --------------------------------------------------------------

    function destroy( e )
    {
        e.preventDefault();
        $.ajax
        ({
            type:   "DELETE",
            url:    'ws/compras/serviciorequerido/'+idregistro,
            success: function( result )
            {
                if( result.result )
                {
                    toastr['success'](result.message, 'Éxito')
                    setTimeout( function(){ amigable(); }, 500);  
                    $("#modal-eliminar").modal('hide');
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

    //------------------------------------------------------------- FUNCION VARIAS -----------------------------------------------------------------

    function restaurar(){
        $("#form-crear").validate().resetForm();
        $("#form-editar").validate().resetForm();
        $('#servicio_requerido').removeClass('valid');
        $('#servicio_requerido').removeClass('error');
        $('#form-editar #servicio_requerido').removeClass('valid');
        $('#form-editar #servicio_requerido').removeClass('error');
        $('#servicio_requerido').val('');
    }
});