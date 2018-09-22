jQuery(document).ready(function ($) {

    var record_id   = 0;
    var id          = 0;
    var ordenSanciones = 0;
    var json_text   = "";
    var json_editar = "";
    var amonestaciones = [];

    if(!jQuery.fn.modal) {
        $.when(
            $.getScript('js/bootstrap.min.js'),
            $.Deferred((deferred)=>{
                $(deferred.resolve);
            })
        ).done(()=>{
            console.log(jQuery.fn.modal);
        });
    }

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
            }
        });
    }
    else {
        
        $.when(
            $.getScript('js/jquery.dataTables.js'),
            $.Deferred(function (deferred) {
                $(deferred.resolve);
            })
        ).done(()=>{
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
                }
            }); 
        });
    }


    loadTable();
    renderSelectGeneralFaults();
    clearInputs();
    cargar_amonestaciones();
    $('#records-table').on('click', 'a.btn-show', showRecord);
    $('#records-table').on('click', 'a.btn-delete', showDeleteRecord);
    
    $('#records-table').on('click', 'a.formulario',function(){
        id = $(this).data('id');
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/faltas/especificas/'+id,
            dataType: 'json'
        }).done(function (response) {
            $('.frmb').append(response.records.formulario_editar);
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {
        });
        $('.form-field').remove();
        $('.clear-all').prop('id','btn-cerrar');
        $('#btn-cerrar').on('click',function(){
            $('#form-modal').modal('hide');
        });
        $('.clear-all').text("Cerrar");
        $('.btn-default').hide();
        $('.save-template').on('click',function(){
            $('.render-wrap').hide();
            json_text   = $('.render-wrap').html();
            json_editar = $('.frmb').html();
            $.ajax({
                type:   'POST',
                url:    'ws/medidas/faltas/especificas/formulario',
                dataType: 'json',
                data:  {json_text: json_text,id:id,json_editar:json_editar}
            }).done(function (response) {
                toastr['success'](response.message, 'Exito');
            }).fail(function (response) {
                toastr['error'](response.message, 'Error');
            }).always(function () {
                $('#form-modal').modal('hide');
                $('#loader').fadeOut();
            });
        });
    });
    $('#btn-store').on('click', storeRecord);
    $('#btn-edit').on('click', updateRecord);
    $('#btn-delete').on('click', deleteRecord);
    $('#btn-add-fault').on('click', addFault);
    $("#new-record").on('click', function openModal(e){
        e.preventDefault();
        sessionStorage['letter'] = JSON.stringify([]);
        $("#store-modal #list-sanctions").html("");
        $("#store-modal #letter").html("<p>Al editar una carta, aquí aparecerá su contenido</p>")
        resetSessionStorage();
        $("#store-modal").modal();
    });

    $("#store-modal").on('hidden.bs.modal', function closeModal() {
        //detener eventos
        $("#store-modal").off("input", '.fieldEditableLetter');
        removeRegistersInSessionStorageLetter();
        ordenSanciones = 0;
    });

    $("#edit-modal").on('hidden.bs.modal', function closeModal() {
        removeRegistersInSessionStorageLetter();
        ordenSanciones = 0;
    });

    var itemsSancions = [];
    
    $(document).on('click', '.btn-add-item-letter', addLetterSanction);
    $("#edit-modal").on('click', '.btn-add-item-letter-edit', addLetterSanctionEdit);
    //agregar item en modal guardar falta espcífica
    $(document).on('click', '.btn-add-item-sanction', function addItemSanction(e) {
        e.preventDefault();
        addItemSanctionFn.call(this, "list-sanctions");
    });

    //agregar item en modal editar falta espcífica
    $(document).on('click', '.btn-add-item-sanction-edit', function addItemSanction(e) {
        e.preventDefault();
        addItemSanctionFnEdit.call(this, "list-sanctions-edit", 'edit');
    });

    //Remover item en modal guardar falta específica
    $(document).on('click', '.btn-remove-item-sanction', function removeItemSanction(e) {
        e.preventDefault();
        //corregir
        var li = $(this).parent().parent().parent();
        var orden = $(this).siblings().eq(3).attr("data-index");
        //var enumeration = $(this).siblings().eq(0).text();
        var idSanction = $(this).siblings().eq(1).val();

        deleteInSessionStorageLetter({id: idSanction, index: orden});
        li.remove();
        enumerateListSanctions();
        $("#store-modal #letter").html("<p>Al editar una carta, aquí aparecerá su contenido</p>");
    });

    //Remover item en modal guardar falta específica
    $(document).on('click', '.btn-remove-item-sanction-edit', function removeItemSanction(e) {
        e.preventDefault();
        var li = $(this).parent().parent().parent();
        var orden = $(this).siblings().eq(3).attr("data-orden") || $(this).siblings().eq(3).attr("data-index");
        var idSanction = $(this).siblings().eq(1).val();
        deleteInSessionStorageLetter({id: idSanction, index: orden});
        li.remove();
        enumerateListSanctions('edit');
        $("#edit-modal #letter").html("<p>Al editar una carta, aquí aparecerá su contenido</p>");
    });

    //botón de agregar sanción en modal guardar falta específica
    $('#list-num-sanciones #add-sanction').on('click', function (e) {
        e.preventDefault();
        addItemSanctionOnList.call(this, "list-sanctions");
    });

    //botón de agregar en modal editar
    $('#list-num-sanciones-edit #add-sanction-edit').on('click', function (e) {
        e.preventDefault();
        addItemSanctionOnListEdit.call(this, "list-sanctions-edit", 'edit');
    });

    $('body').on('click', '.save_letter', function() {
        //var letterHtml = null;
        var letterHtml = $("#letter");
        var previous = $(this).data('previous');

        if(!letterHtml.is(":visible"))
            letterHtml = $("#edit-modal #letter");

        var index = $(this).attr("data-index-item");
        var valid = true;
        letterHtml.find("p[contenteditable]").each((index, p)=>{
            if(!$(p).hasClass('is_entered') || $(p).text().trim().length == 0) { //Si tiene agregada la clase is_entered ó el campo está vacío
                valid = false;
                $(p).addClass('error_editable');
            }
        });

        if(!valid) {
            return toastr['error']('Se deben llenar todos los campos de la carta para poder ser guardada.', 'Error');
        }
        
        if(previous) {
            deleteInSessionStorageLetter(previous);
        }

        //Si pasó el if anterior, entonces guardar el registro
        saveInSessionStorageLetter({id: letterHtml.attr("data-id"), content: letterHtml.html(), index: index});
        toastr['success']('La carta ha sido guardada temporalmente.  La puedes modificar nuevamente si deseas', 'Guardada');
    });

    $("#edit-modal").on('change', '.select-sanciones', ()=>{
        $("#edit-modal .buttons_letter").remove();
        $("#edit-modal #letter").html("<p>Al editar una carta, aquí aparecerá su contenido</p>");
    });

    $("#store-modal").on('change', '.select-sanciones', ()=>{
        $("#store-modal .buttons_letter").remove();
        $("#store-modal #letter").html("<p>Al editar una carta, aquí aparecerá su contenido</p>");
    });


    //Función que se ejecuta al presionar el botón de + en el modal de agregar falta específica
    function addItemSanctionFn(container, isEdit) {
        var li = $(this).parent().parent().parent();
        var prefix = "<li style='margin: 0.5em 0;' class='d-inline-block'>";
        var sufix = "</li>";
        var containerSanctions = $("#" + container);
        var _sanciones = [];
        var sanciones_id = Object.keys(sanciones); //Se obtienen los IDs de las sanciones.  La varible sanciones fue definida en la parte superior del archivo especificas.blade.php
        
        for (var i = 0 ; i < sanciones_id.length ; i++ ) {
            _sanciones.push("<option value='"+ sanciones_id[i] +"'>"+ sanciones[sanciones_id[i]] +"</option>");
        }
        var item = prefix;
        if(isEdit) {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction-edit'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction-edit' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter-edit' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }
        else {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }

        //var item = prefix + "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'> <span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        ordenSanciones += 1;
        itemsSancions.push(item);
        li.after(item);
        itemsSancions = [];
        enumerateListSanctions(isEdit);
    }

    function addItemSanctionFnEdit(container, isEdit) {
        var li = $(this).parent().parent().parent();
        var prefix = "<li style='margin: 0.5em 0;' class='d-inline-block'>";
        var sufix = "</li>";
        var containerSanctions = $("#" + container);
        var _sanciones = [];
        var sanciones_id = Object.keys(sanciones); //Se obtienen los IDs de las sanciones.  La varible sanciones fue definida en la parte superior del archivo especificas.blade.php
        
        for (var i = 0 ; i < sanciones_id.length ; i++ ) {
            _sanciones.push("<option value='"+ sanciones_id[i] +"'>"+ sanciones[sanciones_id[i]] +"</option>");
        }
        var item = prefix;
        if(isEdit) {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction-edit'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction-edit' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter-edit' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }
        else {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }

        //var item = prefix + "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'> <span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        ordenSanciones += 1;
        itemsSancions.push(item);
        li.after(item);
        itemsSancions = [];
        enumerateListSanctions(isEdit);
    }

    function addItemSanctionOnList(container, isEdit) { //Función que se ejecutará al presionar elbotón de AGREGAR SANCIÓN
        var containerSanctions = $("#" + container);
        var _sanciones = [];
        var prefix = "<li class='d-inline-block' style='margin: 0.5em 0;'>";
        var sufix = "</li>";

        var sanciones_id = Object.keys(sanciones); //Se obtienen los IDs de las sanciones.  La varible sanciones fue definida en la parte superior del archivo especificas.blade.php
        
        for(var i = 0 ; i < sanciones_id.length ; i++ ) {
            _sanciones.push("<option value='"+ sanciones_id[i] +"'>"+ sanciones[sanciones_id[i]] +"</option>");
        }

        //var item = prefix + "<div class='row'><div class='col-md-12'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        var item = prefix;
        if(isEdit) {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction-edit'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction-edit' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter-edit' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }
        else {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }
        
        ordenSanciones += 1;
        itemsSancions.push(item);
        containerSanctions.append(item);
        itemsSancions = [];
        //indexItem += 1;
        enumerateListSanctions(isEdit);
    }

    function addItemSanctionOnListEdit(container, isEdit) { //Función que se ejecutará al presionar elbotón de AGREGAR SANCIÓN
        var containerSanctions = $("#" + container);
        var _sanciones = [];
        var prefix = "<li class='d-inline-block' style='margin: 0.5em 0;'>";
        var sufix = "</li>";

        var sanciones_id = Object.keys(sanciones); //Se obtienen los IDs de las sanciones.  La varible sanciones fue definida en la parte superior del archivo especificas.blade.php
        
        for(var i = 0 ; i < sanciones_id.length ; i++ ) {
            _sanciones.push("<option value='"+ sanciones_id[i] +"'>"+ sanciones[sanciones_id[i]] +"</option>");
        }

        //var item = prefix + "<div class='row'><div class='col-md-12'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        var item = prefix;
        if(isEdit) {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction-edit'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction-edit' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter-edit' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }
        else {
            item += "<div class='row'><div class='col-md-12' data-index='"+ ordenSanciones +"'><span class='enumeration'></span> <select class='form-control select-sanciones' style='width: 50%;display: inline-block;'>"+ _sanciones.join("") +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter' data-index='"+ ordenSanciones +"' style='margin-left: 0.5em;'>EDITAR CARTA</a></div></div>" + sufix;
        }
        
        ordenSanciones += 1;
        itemsSancions.push(item);
        containerSanctions.append(item);
        itemsSancions = [];
        //indexItem += 1;
        enumerateListSanctions(isEdit);
    }

    function enumerateListSanctions(edit) {
        var selector = "#list-sanctions";
        if(edit) selector += "-edit";

        $(selector + " li").each((index, li)=>{
            $(li).find(".enumeration").text(index+1 + ". ");
        });
    };

    function addLetterSanction(e) { //Función que se ejecutará al momento de darle click al botón EDITAR CARTA del modal #store-modal
        e.preventDefault();
        $("#letter").on('input', '.fieldEditableLetter', inputEditableFieldLetter); //Cuando el usuario escriba algo en los párrafos editables (contenteditable) al momento de editar la carta, se debe borrar el texto anterior por el nuevo

        var id = $(this).siblings().eq(1).val(); //Se obtiene el ID de la sanción
        
        var index = $(this).data('index');
        let actualizarCarta = (info)=>{
            var xhr = $.getJSON('ws/medidas/amonestaciones/' + id); //Petición AJAX
            xhr
            .done(response=>{
                if(response.result) {
                    var carta_text = response.records.carta_text;
                    var clone_carta = carta_text;
                    var carta = $(carta_text);
                    var inputs = carta.find("input");
                    carta.find("input.input-field-letter").each((index, input)=>{
                        clone_carta =  clone_carta.replace($(input).prop("outerHTML"), "<p contenteditable class='fieldEditableLetter' data-id='"+ $(input).attr("data-index") +"'>"+ $(input).val() +"</p>&nbsp;"); //Se reemplaza el <input /> por <p contenteditable></p>
                    });
                    
                    var htmlButtons;
                    
                    if(info) {
                        htmlButtons = "<div class='buttons_letter'> <button data-previous='"+ JSON.stringify(info) +"' data-index-item='"+ index +"' class='btn btn-primary btn-sm save_letter'>GUARDAR CARTA</button> <p style='word-break: break-word;'><small>Al presionar este botón, se guardará temporalmente y podrá ser editada nuevamente si así lo desea.  Debe de guardar los cambios la carta</small></p> <hr /> </div>";
                    }
                    else {
                        htmlButtons = "<div class='buttons_letter'> <button data-index-item='"+ index +"' class='btn btn-primary btn-sm save_letter'>GUARDAR CARTA</button> <p style='word-break: break-word;'><small>Al presionar este botón, se guardará temporalmente y podrá ser editada nuevamente si así lo desea.  Debe de guardar los cambios la carta</small></p> <hr /> </div>";
                    }

                    $("#store-modal .letter-sanction .buttons_letter").remove();
                    $(htmlButtons).insertBefore("#store-modal .letter-sanction #letter");
                    $("#store-modal #letter").html(clone_carta).attr("data-id", response.records.id);
                }
                else {
                    toastr['error']("No logramos obtener información de la falta.  Intenta nuevamente", "Error");
                }
            })
            .fail(error=>{
                toastr['error'](error.message, "Error");
            })
        };
        searchByIndexSessionStorageLetter(index, (letter)=>{
            if(letter) { //Si está definida la carta en sessionStorage
                if(letter.id != id){ //Si el ID del registro en sessionStorage con el indice de ese item es diferente al id_amonestacion seleccionado en el <select>, entonces ir a consultar la carta de esa nueva amonestación
                    actualizarCarta({
                        id: letter.id,
                        index: index
                    }); //Actualizar la carta con la nueva amonestación seleccionada
                    return; //Se acaba la función
                }                    

                //Si pasa acá, es porque es el mismo registro el consultado en sessionStorage
                $("#store-modal #letter").html(letter.content).attr("data-id", letter.id);
            }
            else { //De lo contrario, si no está definido en sessionStorage, es porque es un nuevo item agregado y por lo tanto consultar en la BD
                actualizarCarta(); //
            }
        });
    }

    function addLetterSanctionEdit(e) { //Función que se ejecutará al darle click al botón EDITAR CARTA en el modal #edit-modal
        e.preventDefault();
        
        var id_registro = $(this).attr("data-id-register");
        var id_amonestacion = $(this).siblings().eq(1).val();
        var orden = $(this).attr("data-orden");
        var id_falta_especifica = $(this).attr("data-id-especifica");
        var indice = $(this).attr("data-index");

        let actualizarCartaEdit = (info)=>{
            $("#edit-modal #letter").on('input', '.fieldEditableLetter', inputEditableFieldLetter); //Cuando el usuario escriba algo en los párrafos editables (contenteditable) al momento de editar la carta, se debe borrar el texto anterior por el nuevo
            
            var xhr = $.getJSON('ws/medidas/amonestaciones/' + id_amonestacion);

            xhr
            .done(response=>{
                if(response.result) {
                    var carta_text = response.records.carta_text;
                    var clone_carta = carta_text;
                    var carta = $(carta_text);
                    var inputs = carta.find("input");

                    carta.find("input.input-field-letter").each((index, input)=>{
                        clone_carta =  clone_carta.replace($(input).prop("outerHTML"), "<p contenteditable class='fieldEditableLetter' data-id='"+ $(input).attr("data-index") +"'>"+ $(input).val() +"</p>&nbsp;"); //Se reemplaza el <input /> por <p contenteditable></p>
                    });
                    
                    var htmlButtons;
                    if(info) {
                        htmlButtons = "<div class='buttons_letter'> <button data-previous='"+ JSON.stringify(info) +"' data-index-item='"+ (indice || orden) +"' class='btn btn-primary btn-sm save_letter'>GUARDAR CARTA</button> <p style='word-break: break-word;'><small>Al presionar este botón, se guardará temporalmente y podrá ser editada nuevamente si así lo desea.  Debe de guardar los cambios la carta</small></p> <hr /> </div>";
                    }
                    else {
                        htmlButtons = "<div class='buttons_letter'> <button data-index-item='"+ (indice || orden) +"' class='btn btn-primary btn-sm save_letter'>GUARDAR CARTA</button> <p style='word-break: break-word;'><small>Al presionar este botón, se guardará temporalmente y podrá ser editada nuevamente si así lo desea.  Debe de guardar los cambios la carta</small></p> <hr /> </div>";
                    }

                    $("#edit-modal .letter-sanction .buttons_letter").remove();
                    $(htmlButtons).insertBefore("#edit-modal .letter-sanction #letter");
                    $("#edit-modal #letter").html(clone_carta).attr("data-id", response.records.id);
                }
                else {
                    toastr['error']("No logramos obtener información de la falta.  Intenta nuevamente", "Error");
                }
            })
            .fail(error=>{
                toastr['error'](error.message, "Error");
            });
        };

        searchByIndexSessionStorageLetter(orden || indice, (letter)=>{
            if(letter) { //Si está definida la carta en sessionStorage
                if(letter.id != id_amonestacion && id_registro){ //Si el ID del registro en sessionStorage con el indice de ese item es diferente al id_amonestacion seleccionado en el <select>, entonces ir a consultar la carta de esa nueva amonestación
                    actualizarCartaEdit({
                        id: letter.id,
                        index: orden || indice
                    }); //Actualizar la carta con la nueva amonestación seleccionada
                    return; //Se acaba la función
                }
                
                if(!id_registro && letter.id != id_amonestacion) {
                    actualizarCartaEdit({
                        id: letter.id,
                        index: indice || orden
                    });
                    return;
                }

                //Cuando sea un nuevo item agregado, id_registro será undefined
                if(!id_registro && letter.id == id_amonestacion) { //buscar por medio del id_amonestacion
                    //console.log("El usuario regreso a la anterior amonestación que estaba guardada");
                    $("#edit-modal #letter").html(letter.content).attr("data-id", letter.id);
                    //actualizarCartaEdit(false);
                    return;
                }

                //Si pasa acá, es porque es el mismo registro el consultado en sessionStorage
                $("#edit-modal #letter").html(letter.content).attr("data-id", letter.id);
            }
            else { //De lo contrario, si no está definido en sessionStorage, es porque es un nuevo item agregado y por lo tanto consultar en la BD
                actualizarCartaEdit(); //
            }
        });
    }

    function loadTable() {
        $('#loader').show();

        $.ajax({
            type:   'GET',
            url:    'ws/medidas/faltas/especificas',
            dataType: 'json'
        }).done(function (response) {   
            window.tabla_registros.clear().draw(false);
            $.each(response.records, function (index, value) {
                if (value.general.pais == localStorage.PAIS) {
                    col1 = ++index;
                    if (value.general) {
                        col2 = value.general.descripcion;
                    }
                    else {
                        col2 = 'Sin falta general asignada';
                    }
                    col3 = value.descripcion;
                    col4 = "<button class='btn btn-primary btn-sm ver-sanciones'>VER SANCIONES</button>";
                    //col4 = 'Sin sanción asiganda';
                    // if (value.sancion) {
                    //     col4 = value.sancion.descripcion;
                    // } else {
                    // }
                    col5 = value.acumulaciones;
                    col6 = value.caducidad;
                    col7 = '<center><a style="margin-left:10px" class="btn btn-xs btn-primary btn-show" data-id="'+value.id+'"><i class="glyphicon glyphicon-edit"></i> Editar</a>'+
                           '<a style="margin-left:10px" href="" class="btn btn-xs btn-danger btn-delete"  data-toggle="modal" data-id="'+value.id+'" style="margin-left: 1%"><i class="glyphicon glyphicon-trash"></i> Eliminar</a>';
                    window.tabla_registros.row.add([col1,col2,col3,col6,col7]).draw(false);
                }
            });
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {
            $('#loader').fadeOut();
        });
    }

    function renderSelectGeneralFaults() {
        var faults = [];
        generals = generals || [];

        var xhr = $.get("ws/sap/data/member",{
            member: JSON.parse(localStorage.OBJETO).userName.toUpperCase()
        });

        xhr
        .done(data => {
            if (data.result) {
                generals.forEach((item) => {
                    if (item.pais == data.records.PAIS) {
                        faults.push("<option value=\""+ item.id +"\" >"+ item.descripcion +"</option>");
                    }
                });
                $("#store-form #general_id, #edit-form #general_id").html(faults.join(""));
            } else {
                // statement
            }
        })
        .fail(error => {
            console.log(error);
        })



    }

    //
    function showRecord (event) {  //mostrar información en modal
        event.preventDefault();
        record_id = $(this).data('id');
        
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/faltas/especificas/'+record_id,
            dataType: 'json'
        }).done(function (response) {
            console.log(response);
            var prefix = "<li style='margin: 0.5em 0;'>";
            var sufix = "</li>";
            var containerSanctions = $("#list-sanctions-edit");
            var _sanciones = [];
            var _sanciones_select = [];
            var sanciones_id = Object.keys(sanciones); //Se obtienen los IDs de las sanciones.  La varible sanciones fue definida en la parte superior del archivo especificas.blade.php
            var __sanciones = response.sanciones; //Se obtienen las sanciones que vinieron en la respuesta del servidor

            var sanciones_li = [];
            var foundItemSelected = false; //Si se encontró una amonestación de las seleccionadas previamente

            console.log(__sanciones);

            for(var i = 0 ; i < __sanciones.length ; i++) { //Se recorre primero las sanciones devueltas por el servidor
                for(var n = 0 ; n < sanciones_id.length ; n++) { //Se recorre el array que contiene los IDs de las sanciones
                    if(__sanciones[i].id_amonestacion == sanciones_id[n]) {
                        _sanciones.push("<option selected data-id='"+ __sanciones[i].id +"' value='"+ sanciones_id[n]  +"' >"+ sanciones[sanciones_id[n]] +"</option>");
                    }
                    else {
                        _sanciones.push("<option value='"+ sanciones_id[n]  +"' >"+ sanciones[sanciones_id[n]] +"</option>");
                    }
                }
                _sanciones_select.push({
                    id: __sanciones[i].id,
                    id_falta_especifica: __sanciones[i].id_falta_especifica,
                    orden: __sanciones[i].orden,
                    sanciones: _sanciones.join("")
                });
                _sanciones = [];
            }
            
            var arrayOrden = [];

            for(var i = 0 ; i < _sanciones_select.length ; i++) {
                sanciones_li.push(prefix + "<div class='row'><div class='col-md-12' data-index='"+ _sanciones_select[i].orden +"'> <span class='enumeration'>"+ (i+1) +". </span> <select class='form-control select-sanciones is_added' style='width: 50%;display: inline-block;'>"+ _sanciones_select[i].sanciones +"</select><a href='#' style='margin-left: 1em;' class='btn btn-primary btn-sm btn-add-item-sanction-edit'><i class='glyphicon glyphicon-plus'></i></a><a href='#' class='btn btn-danger btn-sm btn-remove-item-sanction-edit' style='margin-left: 0.5em;' ><i class='glyphicon glyphicon-remove'></i></a><a href='#' class='btn btn-danger btn-sm btn-add-item-letter-edit' style='margin-left: 0.5em;' data-id-especifica='"+ _sanciones_select[i].id_falta_especifica +"' data-id-register='"+ _sanciones_select[i].id +"' data-orden='"+ _sanciones_select[i].orden +"'>EDITAR CARTA</a></div></div>" + sufix)
                arrayOrden.push(_sanciones_select[i].orden);
            }
            
            ordenSanciones = Math.max.apply(null, arrayOrden) + 1; //Saber cuál es el número de orden mayor
            
            var copy = __sanciones;

            copy = copy.map((val)=>{
                return {
                    id: val.id_amonestacion,
                    index: val.orden,
                    content: val.carta
                };
            });

            resetSessionStorage();
            renderSelectGeneralFaults();
            saveInSessionStorageLetter(copy);

            $("#edit-form #list-sanctions-edit").html("").append(sanciones_li.join(""));
            
            $('#edit-form #descripcion').val(response.records.descripcion);
            $('#edit-form #caducidad').val(response.records.caducidad);
            //$('#edit-form #acumulaciones').val(response.records.acumulaciones);
            $('#edit-form #general_id').val(response.records.general_id);
            //$('#edit-form #amonestacion_id').val(response.records.amonestacion_id);
            $("#edit-modal #letter").html("<p>Al editar una carta, aquí aparecerá su contenido</p>");
            $("#edit-modal").modal();
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {

        });
    }

    function storeRecord (event) {
        event.preventDefault();
        
        var letters = JSON.parse(sessionStorage['letter']);
        var listSanctionsLength = $("#list-sanctions li").length;

        if(letters.length != listSanctionsLength) {
            return toastr['error']("No has guardado todas las cartas de las sanciones que has agregado.  Guardalas para poder continuar.", "Error");
        }

        var __sanciones = $("#store-modal .select-sanciones"); //Se obtienen todos los <select> de las sanciones
        var __sanciones_list = [];
        
        __sanciones.each((index, sancion)=>{
            searchInSessionStorageLetter({id: $(sancion).val(),index: $(sancion).parent().data('index')}, response=>{
                __sanciones_list.push(response);
            });
        });

        data = {
            descripcion: $('#store-form #descripcion').val(),
            general_id: $('#store-form #general_id').val(),
            caducidad: $('#store-form #caducidad').val(),
            sanciones: __sanciones_list
        };

        if(data.descripcion.trim().length == 0) {
            toastr['error']("No puedes dejar la descripcion vacía", "Error");
            return;
        }

        if(data.caducidad == "" || data.caducidad == 0) {
            toastr['error']("No puedes dejar el campo caducidad vacío o en cero", "Error");
            return;
        }

        if(data.sanciones.length == 0) {
            toastr['error']("Debes agregar por lo menos una sanción", "Error");
            return;
        }

        $.ajax({
            type:   'POST',
            url:    'ws/medidas/faltas/especificas',
            dataType: 'json',
            data:   data
        }).done(function (response) {
            console.log(response);
            loadTable();
            $('#store-modal').modal('hide');
            toastr['success'](response.message, 'Éxito');
            clearInputs();
            removeRegistersInSessionStorageLetter(); //Se eliminan todos los registros de sessionStorage['letter']
        }).fail(function (response) {
            console.log(response);
            toastr['error'](response.message, 'Error');
        }).always(function () {
            
        });
    }

    function updateRecord (event) {
        event.preventDefault();

        var letters = JSON.parse(sessionStorage['letter']);
        var listSanctionsLength = $("#list-sanctions-edit li").length;
        
        if(letters.length != listSanctionsLength) {
            return toastr['error']("No has guardado todas las cartas de las sanciones que has agregado.  Guardalas para poder continuar.", "Error");
        }

        var _sanciones_select = $("#list-sanctions-edit .select-sanciones");
        var __sanciones_list = [];

        _sanciones_select.each((index, sancion)=>{
            searchInSessionStorageLetter({id: $(sancion).val(),index: $(sancion).parent().data('index')}, response=>{
                if(response) {
                    if($(sancion).siblings().eq(3).attr("data-id-register")) {
                        response.id_registro = $(sancion).siblings().eq(3).attr("data-id-register");
                    }
                    __sanciones_list.push(response);
                    
                }
            });
        });

        data = {
            descripcion: $('#edit-form #descripcion').val(),
            general_id: $('#edit-form #general_id').val(),
            caducidad: $('#edit-form #caducidad').val(),
            sanciones: __sanciones_list
        };
        
        if(data.descripcion.trim().length == 0) {
            toastr['error']("No puedes dejar la descripcion", "Error");
            return;
        }

        if(data.caducidad == "" || data.caducidad == 0) {
            toastr['error']("No puedes dejar el campo caducidad vacío o en cero", "Error");
            return;
        }

        if(data.sanciones.length == 0) {
            toastr['error']("Debes agregar por lo menos una sanción", "Error");
            return;
        }

        //console.log(data);

        $.ajax({
            type:   'PUT',
            url:    'ws/medidas/faltas/especificas/'+record_id,
            dataType: 'json',
            data:   data
        }).done(function (response) {
            loadTable();
            $('#edit-modal').modal('hide');
            toastr['success'](response.message, 'Éxito');
            clearInputs();
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {});
    }

    function showDeleteRecord (event) {
        event.preventDefault();
        record_id = $(this).data('id');
        $("#delete-modal").modal();
    }

    function deleteRecord (event) {
        event.preventDefault();
        $.ajax({
            type:   'DELETE',
            url:    'ws/medidas/faltas/especificas/'+record_id,
            dataType: 'json'
        }).done(function (response) {
            loadTable();
            $('#delete-modal').modal('hide');
            toastr['success'](response.message, 'Éxito');
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {

        });
    }
    //<option value="1">Amonestación</option>
    function addFault(event) {
        event.preventDefault();

        contador = $('.amonestaciones');
        select = '';
        $.each(amonestaciones, function(index, value){
            select += '<option value="'+value.id+'">'+value.descripcion+'</option>';
        });
        $('#store-form')
            .append(
                '<fieldset class="amonestaciones">' +
                '<div class="col-sm-4">' +
                    '<label>Acumulaciones</label>' +
                    '<input type="number" class="form-control acumulaciones" value="'+(contador.length + 1)+'" readonly>' +
                '</div>' +
                '<div class="col-sm-8">' +
                    '<label>Sanción</label>' +
                    '<select class="form-control amonestaciones_id">' +
                        select +
                    '</select>' +
                '</div>' +
                '</fieldset>'
            );
    }

    function cargar_amonestaciones() {
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/amonestaciones',
            dataType: 'json'
        }).done(function (response) {
            if(response.result) {
                amonestaciones = response.records;
            }
            else {
                amonestaciones = [];
            }
        }).fail(function (response) {
            amonestaciones = [];
        }).always(function () {

        });
    }

    function clearInputs () {
        $('#store-form')[0].reset();
        $('#edit-form')[0].reset();
    }

    function inputEditableFieldLetter(e) {

        if($(this).hasClass('error_editable')) { //Si tiene la clase error_editable, es porque 
            $(this).removeClass('error_editable');
        }

        if(!$(this).hasClass('is_entered')) { //Si ya tiene la clase is_clicked, es porque ya fue ejecutado el evento en ese elemento
            $(this).addClass('is_entered'); //Se le agrega la clase is_clicked, para que a la siguiente vez, ya no entre al if
            $(this).text(e.originalEvent.data).caret(1); //Se le coloca el nuevo texto, y se posiciona el "caret" en la posición uno
            return;
        }

    }

    function deleteInSessionStorageLetter(letter) {
        var prev = JSON.parse(sessionStorage['letter']);
        var isFound = false;

        for(var i = 0 ; i < prev.length ; i++) {
            if(prev[i].id == letter.id && prev[i].index == letter.index) {
                prev.splice(i, 1);
                isFound = true;
                break;
            }
        }

        if(isFound) {
            sessionStorage['letter'] = JSON.stringify(prev);
            return true;
        }
        return false;
    };

    function removeRegistersInSessionStorageLetter() {
        sessionStorage['letter'] = JSON.stringify([]);
    };

    function saveInSessionStorageLetter(letter) { //Guardar las cartas en session storagfe
        if(!letter.forEach) { //Si no es un array, entonces se convierte a un array
            letter = [letter];
        }

        var prev = JSON.parse(sessionStorage['letter']); //Valores anteriores
        var isFound = false; //Indicador si ya fue encontrado un valor dentro de los registros de sessionStorage['letter']
        
        for(var i = 0 ; i < prev.length ; i++) { //Se recorre el contenido de sessionStorage['letter']
            for(var k = 0 ; k < letter.length ; k++) { //Se recorre el array que vino como parámetro de la función (si lo que viene de argumento es un objeto, entonces se convierte a un array)
                if(prev[i].id == letter[k].id && prev[i].index == letter[k].index) { //Si el ID de la carta registrada, es igual al ID que se quiere agregar, entonces se debe modificar el contenido
                    prev[i].content = letter[k].content; //Se modifica el content
                    sessionStorage['letter'] = JSON.stringify(prev);
                    isFound = true;
                    break;
                }
            }
        }

        if(!isFound) { //Si no se encontró ningún registro con el mismo ID, entonces es porque es nuevo
            letter.forEach((item) => {
                prev.push(item);
            })
            sessionStorage['letter'] = JSON.stringify(prev);
        }
    };

    function searchByIndexSessionStorageLetter(index, callback) {
        var prev = JSON.parse(sessionStorage['letter']);
        var el = null;
        for(var i = 0 ; i < prev.length ; i++) {
            if(prev[i].index == index) {
                el = prev[i];
                break;
            }
        }
        return callback(el);
    }

    function searchInSessionStorageLetter(letter, callback) {
        var prev = JSON.parse(sessionStorage['letter']);
        var el = null;
        for (var i = 0 ; i < prev.length; i++) {
            if(prev[i].index == letter.index && prev[i].id == letter.id) {
                el = prev[i];
                break;
            }
        }
        return callback(el);  
    };

    function resetSessionStorage() {
        sessionStorage['letter'] = JSON.stringify([]);
    }

});