$(document).ready(function() {
  /* your code */

    function domain_from_url(url) {
        url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
        return url;
    }

    html = '';
    $('#add_new_site').on('click', function(){
        var site_val = $('#new_site').val();
        site_data = {
            id: '',
            icon: '',
        };
        $('#add_new_site').text('Loading...');
        site_val = domain_from_url(site_val);
         jQuery.ajax({
            url: "http://"+site_val+"/?vlab_json_notification",
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res, status, jq) {
                chrome.storage.sync.get([site_val], function(items) {
                    if(items[site_val]){
                        $('#error_message').text('You have added this website already.');

                    }else{
                        chrome.storage.sync.set({[site_val]: site_data}, function() {
                            $('#new_site').val('');
                            chrome.runtime.reload();
                        });

                    }

                });

            },
            error: function(){
                $('#new_site').css("border-color", "red");
                $('#error_message').text('This website doesn\'t use our plugin.');
                jQuery.ajax({
                    url: "https://itsvalentin.com/v4_notification_req.php",
                    type: 'GET',
                    data: {
                        'domain': site_val,
                    },
                    success: function(res, status, jq) {

                    },
                });
            }
        });

    });

    chrome.storage.sync.get(null, function(items) {

        for (i = 0; i < Object.keys(items).length; i++) {
            var value = Object.keys(items)[i];
            if(value == 'user_key'){
                continue;
            }
            value_no_dot = value.split('.').join("");
            html = '<div class="website" id="full_'+value_no_dot+'" style="width:100%;"><a href="#" class="popup_link" url="'+value+'">'+value+'</a> - <a href="#" id="'+value+'" class="remove" style="color:#ff0000;">Remove</a></div><br>';
            $('#websites').append(html);
         
            
        }

        $('a.popup_link').on('click', function(){
            if($(this).attr('url')){
                chrome.tabs.create({ url: 'http://'+$(this).attr('url') });
            }
        });

        $('a.remove').on('click', function(){
            if($(this).attr('id')){
                var id = $(this).attr('id');
                id_no_dot = id.split('.').join("");
                chrome.storage.sync.remove([id], function(val){
                    if($('#full_'+id_no_dot)){
                         $('#full_'+id_no_dot).hide();
                    }else{
                        chrome.runtime.reload();
                    }
                });  
            }
        });        
    });
});

document.addEventListener("DOMContentLoaded", function() {
    function CheckIsValidDomain(domain) { 
        var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
        return domain.match(re);
    } 




});