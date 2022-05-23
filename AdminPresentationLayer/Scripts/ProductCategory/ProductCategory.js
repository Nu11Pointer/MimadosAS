// Variables Globales
var rowSelected;
var productCategoryTable;
var productCategoryObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuProducts').addClass('active');
    $('#collapseFive').addClass('show');
    $('#CollapseMenuItemCategory').addClass('active');

    // Show DataTable
    Read();


    // Crear Validaciones
    Validator();

    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
}

function Read() {
    productCategoryTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/ProductCategory/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#ActiveCreate").val(1);
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
}

function Validator() {
    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: "- El campo \"Nombre\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: "- El campo \"Nombre\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    productCategoryObj = {
        "Id": 0,
        "Name": $("#NameCreate").val(),
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/ProductCategory/Create',
        type: "POST",
        data: JSON.stringify({ productCategory: productCategoryObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            productCategoryTable.ajax.reload();
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalCreate").modal("hide");
                productCategoryTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear El Categoria.", response.message, "error");
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    productCategoryObj = productCategoryTable.row(rowSelected).data();

    $("#NameUpdate").val(productCategoryObj.Name);
    $("#ActiveUpdate").val(productCategoryObj.Active ? 1 : 0);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    productCategoryObj = {
        "Id": productCategoryObj.Id,
        "Name": $("#NameUpdate").val(),
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/ProductCategory/Update',
        type: "POST",
        data: JSON.stringify({ productCategory: productCategoryObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalUpdate").modal("hide");
                productCategoryTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar el Categoria.", response.message, "error");
            }
        },
        error: function (error) {

            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Delete() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    productCategoryObj = productCategoryTable.row(rowSelected).data();

    swal({
        title: "Eliminar Categoria",
        text: "¿Estas Seguro que Deseas Eliminar Esta Categoria?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/ProductCategory/Delete',
                type: "POST",
                data: JSON.stringify({ productCategory: productCategoryObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        productCategoryTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar el Categoria.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        }
    );
}
