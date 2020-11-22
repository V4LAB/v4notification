var isValid = true;
var website = '';

function domain_from_url(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    return url;
}
chrome.storage.sync.get('user_key', function(items) {
    if(!items['user_key']){
        jQuery.ajax({
            url: "https://itsvalentin.com/user_key_generate.php?plugin=v4_notification",
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res, status, jq) {
                if(res){
                    if((res.status && res.status == 'success') && res.message){
                        chrome.storage.sync.set({user_key: res.message}, function() {
                            chrome.runtime.reload();
                        });  
                    }
                }

 
            },
        });
        
    }else{
        user_key = items['user_key'];
    }


setInterval(function(){
chrome.storage.sync.get(null, function(items) {

    for (i = 0; i < Object.keys(items).length; i++) {
        if(Object.keys(items)[i] == 'user_key'){
            continue;
        }
        chrome.storage.sync.get(Object.keys(items)[i], function(items) {

        website = Object.keys(items)[0];
        

        jQuery.ajax({
            url: "http://"+website+"/?vlab_json_notification",
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res, status, jq) {
                //
                var domain = domain_from_url(jq.website.url);
                
                console.log(domain);
                if(!res){
                    return;
                }

                icon = 'icon.png';
                if(res.icon && res.icon.value < 1){
                    icon = res.icon; 
                }

                var url = res.url;
                
                chrome.storage.sync.get([domain], function(items) {

                    if(items[domain].id == res.id){
                        return;
                    }

                    var c_type = 'basic';
                    if(res.thumbnail != ''){
                        c_type = 'image';
                    }
                    if(res.icon == ''){
                        res.icon = 'icon.png';
                    }
              
                    chrome.notifications.create(
                        'not-' + res.id,{   
                        type: c_type, 
                        imageUrl: res.thumbnail,
                        iconUrl: res.icon,
                        title: res.title, 
                        message: ''+domain+'\n'+res.content,
                        requireInteraction : true,
                        }, function(e) {
                            chrome.notifications.onClicked.addListener(function(tab){
                                chrome.tabs.create({'url': url}, function(tab) {
                                    //tab opened
                                });
                            });

                            var data = {
                                'id': res.id,
                                'icon': res.icon,
                            };  

                            chrome.storage.sync.set({[domain]: data}, function() {
                                
                            });                       


                        } 
                    );
                });

            },
            beforeSend:function( data, website){
                
                 data.website = website;
           },
            error: function(data, text, error){
                //console.log(1);
                error_domain = domain_from_url(data.website.url);

                chrome.storage.sync.remove([error_domain], function(val){
                
                });       
        
                //console.log(Object.keys(items)[i]);
         
            }
        });
        });
    }
});

}, 60000);
});
