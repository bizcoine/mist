// implement chai's should interface
var expect = chai.expect;

describe("Permissions", function() {

    describe('permissions', function() {
        it('should be available', function() {
            expect(permissions).to.be.an('object', 'The permissions object was not present, please reload the test page');
            expect(permissions.accounts).to.be.an('array', 'The permissions object was not present, please reload the test page');
        });
    });

    describe('web3.eth.accounts', function() {

        it('should return an array [sync]', function() {
            var accounts = web3.eth.accounts;
            expect(accounts).to.be.an('array');
        });

        it('should return an array [async]', function(done) {
            web3.eth.getAccounts(function(e, accounts){
                expect(e).to.be.null;
                expect(accounts).to.be.an('array');

                done();
            });
        });

        it('should match the allowed accounts in the tabs permisssions [sync]', function(done) {
            var accounts = web3.eth.accounts;

            expect(permissions.accounts.length).to.equal(accounts.length);
            accounts.forEach(function(account){
                expect(permissions.accounts).to.include(account);
            });

            done();
        });

        it('should match the allowed accounts in the tabs permisssions [async]', function(done) {
            web3.eth.getAccounts(function(e, accounts){
                expect(permissions.accounts.length).to.equal(accounts.length);
                accounts.forEach(function(account){
                    expect(permissions.accounts).to.include(account);
                });

                done();
            });
        });


        it('should match the allowed accounts in the tabs permisssions [async, batch request]', function(done) {
            var count = 1;

            var callback = function(e, accounts){
                expect(permissions.accounts.length).to.equal(accounts.length);
                accounts.forEach(function(account){
                    expect(permissions.accounts).to.include(account);
                });

                if(count === 2)
                    done();

                count++;
            };

            var batch = web3.createBatch();
            batch.add(web3.eth.getAccounts.request(callback));
            batch.add(web3.eth.getAccounts.request(callback));
            batch.execute();
        });

    });

   describe('web3 attributes', function() {
        it('shouldn\'t allow `admin`', function () {
            expect(web3.admin).to.be.undefined;
        });

        it('shouldn\'t allow IPC provider', function () {
            expect(web3.ipc).to.be.undefined;
        });

        it('should only contain allowed attributes', function (){
            var allowedAttributes = [
                '_requestManager',
                'currentProvider',
                'eth',
                'db',
                'shh',
                'net',
                'personal',
                'settings',
                'version',
                'providers',
                '_extend'
            ];

            expect(web3).to.have.all.keys(allowedAttributes);
        });
    });
});
