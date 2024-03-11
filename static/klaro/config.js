var klarConfig = {
    acceptAll: true,
    services: [
        {
            name: 'google-tag-manager',
            purposes: ['marketing'],
            onAccept: `
                // we notify the tag manager about all services that were accepted. You can define
                // a custom event in GTM to load the service if consent was given.
                for(let k of Object.keys(opts.consents)){
                    if (opts.consents[k]){
                        let eventName = 'klaro-'+k+'-accepted'
                        dataLayer.push({'event': eventName})
                    }
                }
                // if consent for Google Analytics was granted we enable analytics storage
                if (opts.consents[opts.vars.googleAnalyticsName || 'google-analytics']){
                    console.log("Google analytics usage was granted")
                    gtag('consent', 'update', {'analytics_storage': 'granted'})
                }
                // if consent for Google Ads was granted we enable ad storage
                if (opts.consents[opts.vars.adStorageName || 'google-ads']){
                    console.log("Google ads usage was granted")
                    gtag('consent', 'update', {'ad_storage': 'granted'})
                }
            `,
            onInit: `
                // initialization code here (will be executed only once per page-load)
                window.dataLayer = window.dataLayer || [];
                window.gtag = function(){dataLayer.push(arguments)}
                gtag('consent', 'default', {'ad_storage': 'denied', 'analytics_storage': 'denied'})
                gtag('set', 'ads_data_redaction', true)
            `,
            onDecline: `
                // initialization code here (will be executed only once per page-load)
                window.dataLayer = window.dataLayer || [];
                window.gtag = function(){dataLayer.push(arguments)}
                gtag('consent', 'default', {'ad_storage': 'denied', 'analytics_storage': 'denied'})
                gtag('set', 'ads_data_redaction', true)
            `,
            vars: {
                googleAnalytics: 'google-analytics'
            }
        },
        {
            // In GTM, you should define a custom event trigger named `klaro-google-analytics-accepted` which should trigger the Google Analytics integration.
            name: 'google-analytics',
            purposes: ['marketing'],
            cookies: [
                /^_ga(_.*)?/ // we delete the Google Analytics cookies if the user declines its use
            ],
        }
    ]
}