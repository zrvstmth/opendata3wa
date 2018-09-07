$(function(){
    console.log('hello, it\'s me..');

    if($('.auto_message').length) 
    {
        window.setTimeout(function() {
            // slideUp()+fadeOut() animation
            $('.auto_message').animate({opacity: 'hide', height: 'hide'}, 'slow');
        }, 1000);
    } 
});