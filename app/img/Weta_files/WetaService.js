/**
 * Created by murray on 6/03/17.
 */
function WetaService(http, log)
{
    this.http    = http;
    this.log     = log;
    this.address = null;
    this.select  = null;
    this.status  = null;
    this.configuration  = {};
    this.capabilities  = {};
}

WetaService.prototype.setAddress =
    function(addr)
    {
        this.address = addr;
    };

WetaService.prototype.getAddress =
    function()
    {
        return this.address;
    };

WetaService.prototype.getStatus =
    function()
    {
        return this.status;
    };

WetaService.prototype.getConfiguration =
    function()
    {
        return this.configuration;
    };

WetaService.prototype.getCapabilities =
    function()
    {
        return this.capabilities;
    };

WetaService.prototype.toQuery =
    function(selection)
    {
        var query = null;
        for (var item in selection)
        {
            if (selection[item])
            {
                if (query)
                    query += ",";
                else
                    query = "query=";

                query += item;
            }
        }
       return query;
    };

WetaService.prototype.query =
    function(address, selection, onsuccess, onfailure)
    {
        this.address = address.trim();
            // Call toQuery() with all the arguments we received.
        var query = this.toQuery(selection);
        var config =
            {
                method: "GET",
                url: "http://" + this.address + "/weta?" + query,

            };
        this.http(config)
            .then(onsuccess, onfailure);
    };

WetaService.prototype.queryConfiguration =
    function(address)
    {
        this.query(
            address,
            {config: true},
            this.configQuerySuccess.bind(this),
            this.queryError.bind(this)
        );
    };

WetaService.prototype.queryStatus =
    function(address)
    {
        this.query(
            address,
            {status: true},
            this.statusQuerySuccess.bind(this),
            this.queryError.bind(this)
        );
    };

WetaService.prototype.queryCapabilities =
    function(address)
    {
        this.query(
            address,
            {caps: true},
            this.capsQuerySuccess.bind(this),
            this.queryError.bind(this)
        );
    };

WetaService.prototype.statusQuerySuccess =
    function(response)
    {
        //this.log.log("Query success!");
        Object.assign(this.status,response.data);
    };

WetaService.prototype.configQuerySuccess =
    function(response)
    {
        //this.log.log("Query success!");
         Object.assign(this.configuration,response.data);
    };

WetaService.prototype.capsQuerySuccess =
    function(response)
    {
        //this.log.log("Query success!");
        Object.assign(this.capabilities,response.data);
    };

WetaService.prototype.queryError =
    function(response)
    {
        this.result = null;
        this.log.log("Query error:" + response.statusText);
    };

