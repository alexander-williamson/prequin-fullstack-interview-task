using FluentMigrator;

namespace migrations
{
    [Migration(202502071802)]
    public class CreateInvestmentsTable : Migration
    {
        const string investments_summary = "investments_summary";
        const string investors_summary = "investors_summary";

        public override void Up()
        {
            Create.Table(investments_summary)
                .WithColumn("id").AsString(36).PrimaryKey()
                .WithColumn("investor_id").AsString(36).NotNullable()
                    .ForeignKey("fk_investments_investors", investors_summary, "id")
                .WithColumn("asset_class").AsString(100).NotNullable()
                .WithColumn("amount").AsDecimal().NotNullable()
                .WithColumn("currency").AsString(10).NotNullable();
        }

        public override void Down()
        {
            Delete.Table(investments_summary);
        }
    }
}
