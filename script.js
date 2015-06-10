'use strict';

$(function() {
    var sound = new Howl({
      urls: ['tac.wav', 'tac.ogg']
    });

    var country = '';

    var tweet = function(event) {
        event.preventDefault();

        if (country.length > 0) {
            var text = encodeURIComponent('UE : j\'ai fait tourner l\'EXITroulette, ' + country + ' devrait sortir. A vous de jouer ! #exitroulette'),
                url  = encodeURIComponent(window.location.href),
                link = 'https://twitter.com/intent/tweet?original_referer=' + '' + '&text=' + text + ' ' + url;

            window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
        }
    };

    var showText = function(prefix) {
        if (prefix == null) {
            prefix = $('div#exit li').first().text();
        }

        prefix = prefix.toUpperCase();

        var data = window.data[prefix];
        if (data != null) {
            $('h2.title').empty().text(data.titre.trim() + ' ')
                         .append($('<a>').addClass('tweet')
                                         .attr('href', '#')
                                         .append('<i>').addClass('fa fa-twitter-square'));
            $('h3.subtitle').empty().text(data.soustitre);
            $('p.text').empty().html(data.description);

            if (data.lien != null && data.lien.length > 0) {
                $('p.lireaussi span.lien').empty().append($('<a>').text(data.titrelien)
                                                                  .attr('href', data.lien)
                                                                  .attr('target', '_blank'));
                $('p.lireaussi').css('display', 'block');
            } else {
                $('p.lireaussi').css('display', 'none');
            }

            country = data.pays;

            $('a.tweet').on('click', tweet);
        }
    };

    window.go = (function() {
        var limit, brake,
            started = false;

        var recurse = function(n, x) {
            sound.play();

            $('#exit li').each(function(i) {
                $(this).css({
                    position : 'absolute',
                    top : i * $(this).height()
                });
                var top = parseInt($(this).css('top'));
                $(this).animate({ top : (top - $(this).height()) + 'px' }, {
                    duration : n,
                    complete : function() {
                        if (i === 0) {
                            $(this).detach().appendTo('#exit');
                            if (n < limit) {
                                recurse(n + x, x + brake);
                            } else {
                                showText();
                                started = false;
                            }
                        }
                    }
                });
            });
        };

        return function() {
            if (!started) {
                limit = Math.floor(Math.random() * 350) + 75;
                brake = Math.floor(Math.random() * 2) + 1;

                $('#exit').empty();
                for (var i in window.data) {
                    if (window.data.hasOwnProperty(i)) {
                        $('#exit').append($('<li>').text(window.data[i].prefixe));
                    }
                }

                started = true;
                recurse(50, 1);
            }
        };
    })();

    d3.tsv('./exit.tsv', function(data) {
        window.data = _.indexBy(data, 'prefixe');
    });
});
