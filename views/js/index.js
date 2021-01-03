$(document).ready(function () {
    fetchandShowProductsTable();

});


$("#add-product-form").submit(function (e) {

    e.preventDefault();
    if (!checkEmptyFeilds()) {
        //var form = new FormData(this); 
        var form = $(this);
        var url = form.attr("action");

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
                if (data == 1) {
                    showSweetAlert("Perfect!", "Product has been successfully added", "success");
                    fetchandShowProductsTable();
                    $("#id,#name,#description,#price").val("");
                } else {
                    showSweetAlert("Oops!", "An error occurred", "error");
                }
            }
        });
    } else {
        showSweetAlert("Ohh no no!", "Please enter all values", "warning");
    }
});


function deleteProduct(id) {
    var form = new FormData();
    form.append("index", id);
    var url = "/delete-product";

    $.ajax({
        type: "POST",
        url: url,
        data: {
            "index": id
        },
        success: function (data) {
            if (data == 1) {
                showSweetAlert("Perfect!", "Product has been successfully deleted", "success");
                fetchandShowProductsTable();
            } else if (data == -1) {
                showSweetAlert("Yikes!", "There should be atleat 1 product in our store", "warning");
            } else {
                showSweetAlert("Oops!", "An error occurred", "error");
            }
        }
    });
}

// this code snippet is taken from internet (stackoverflow)
function getDeleteConfirmation(id) {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this product!",
        icon: "warning",
        buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
        ],
        dangerMode: true,
    }).then(function (isConfirm) {
        if (isConfirm) {
            deleteProduct(id);
        }
    })
}


function fetchandShowProductsTable() {
    $("#products-section").empty();
    $.ajax({
        url: "/getProducts",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#products-section").append(data);
            $('#products-table').DataTable();
        }
    });
}

function checkEmptyFeilds() {
    if ($("#id").val() == "" || $("#name").val() == "" || $("#description").val() == "" || $("#price").val() == "") {
        return true;
    } else {
        return false;
    }
}

function showSweetAlert(alertTitle, alertText, alertIcon) {
    swal({
        title: alertTitle,
        text: alertText,
        icon: alertIcon,
    });
}

function updateProduct(id) {
    getProductById(id);
}

function getProductById(id) {
    var form = new FormData();
    form.append("index", id);
    var url = "/get-product-by-id";

    $.ajax({
        type: "POST",
        url: url,
        data: {
            "id": id
        },
        success: function (data) {
            openAndPopulateUpdateModal(data,id);
        }
    });
}

function openAndPopulateUpdateModal(data,index){
    $("#edit-index").val(index);
    $("#edit-id").val(data.id);
    $("#edit-name").val(data.name);
    $("#edit-description").val(data.description);
    $("#edit-price").val(data.price);
    $("#edit-product-modal").modal("toggle");
}


$("#edit-product-form").submit(function (e) {

    e.preventDefault();
    if (!checkEmptyFeildsOfUpdateModal()) {
        //var form = new FormData(this); 
        var form = $(this);
        var url = form.attr("action");

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
                if (data == 1) {
                    showSweetAlert("Perfect!", "Product has been successfully updated", "success");
                    fetchandShowProductsTable();
                    $("#edit-product-modal").modal("toggle");
                } else {
                    showSweetAlert("Oops!", "An error occurred", "error");
                }
            }
        });
    } else {
        showSweetAlert("Ohh no no!", "Please enter all values", "warning");
    }
});

function checkEmptyFeildsOfUpdateModal() {
    if ($("#edit-id").val() == "" || $("#edit-name").val() == "" || $("#edit-description").val() == "" || $("#edit-price").val() == "") {
        return true;
    } else {
        return false;
    }
}