using FluentMigrator;

namespace migrations
{
    [Migration(202502071804), Tags("seed")]
    public class SeedTables : Migration
    {
        const string investors_summary = "investors_summary";
        const string investments_summary = "investments_summary";

        public override void Up()
        {
            var csvPath = "../data.csv";
            var lines = File.ReadAllLines(csvPath);

            // build up a list of unique Investors
            var investorLookup = new List<string>();

            var investorList = lines
                .Skip(1) // skip the header line
                .Select(line => line.Split(',')) // split by comma
                .Select(parts => new
                {
                    Name = parts[0].Trim(),
                    InvestorType = parts[1].Trim(),
                    Country = parts[2].Trim(),
                    Added = DateTime.Parse(parts[3].Trim()),
                    Updated = DateTime.Parse(parts[4].Trim())
                })
                .ToList();

            var uniqueInvestors = investorList
                .GroupBy(i => new { i.Name, i.InvestorType, i.Country, i.Added, i.Updated })
                .Select(grp => grp.First())
                .Select(item => new Investor
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = item.Name,
                    Country = item.Country,
                    InvestorType = item.InvestorType,
                    CommitmentsTotal = 0,
                    Added = item.Added,
                    Updated = item.Updated
                })
                .ToList();

            var duplicateNames = uniqueInvestors
                .GroupBy(i => i.Name)
                .Where(g => g.Count() > 1)
                .Select(x => x.Key)
                .ToList();

            if (duplicateNames.Count > 0)
            {
                throw new Exception("Detected duplicate investors in dataset. Check: " + string.Join(", ", duplicateNames));
            }

            var investmentLines = lines
               .Skip(1) // skip the header line
               .Select(line => line.Split(',')) // split by comma
               .Select(parts => new Investment
               {
                   Id = Guid.NewGuid().ToString(),
                   InvestorId = uniqueInvestors.First(x => x.Name == parts[0]).Id,
                   AssetClass = parts[5],
                   Amount = float.Parse(parts[6]),
                   Currency = parts[7]
               })
               .ToList();

            foreach (var investor in uniqueInvestors)
            {
                var commitmentsTotal = investmentLines.Where(x => x.InvestorId == investor.Id).Sum(line => line.Amount);
                Insert.IntoTable(investors_summary).Row(new
                {
                    id = investor.Id,
                    name = investor.Name,
                    country = investor.Country,
                    type = investor.InvestorType,
                    commitments_total = commitmentsTotal,
                    date_added = investor.Added,
                    last_updated = investor.Updated
                });
            }

            foreach (var line in investmentLines)
            {
                Insert.IntoTable(investments_summary).Row(new
                {
                    id = line.Id,
                    investor_id = line.InvestorId,
                    asset_class = line.AssetClass,
                    amount = line.Amount,
                    currency = line.Currency
                });
            }
        }

        public override void Down()
        {
            Delete.FromTable(investments_summary).AllRows();
            Delete.FromTable(investors_summary).AllRows();
        }
    }

    public class Investor
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string InvestorType { get; set; }
        public required string Country { get; set; }
        public required decimal CommitmentsTotal { get; set; }
        public DateTime Added { get; set; }
        public DateTime Updated { get; set; }
    }

    public class Investment
    {
        public required string Id { get; set; }
        public required string InvestorId { get; set; }
        public required string AssetClass { get; set; }
        public required float Amount { get; set; }
        public required string Currency { get; set; }
    }

}
