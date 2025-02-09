using FluentMigrator;

namespace migrations
{
    [Migration(202502071801)]
    public class CreateInvestorsTable : Migration
    {
        const string investors_summary = "investors_summary";

        public override void Up()
        {
            Create.Table(investors_summary)
                .WithColumn("id").AsString(36).PrimaryKey()
                .WithColumn("name").AsString(200).NotNullable()
                .WithColumn("type").AsString(100).NotNullable()
                .WithColumn("country").AsString(100).NotNullable()
                .WithColumn("commitments_total").AsDecimal().NotNullable()
                .WithColumn("date_added").AsDateTime().NotNullable()
                .WithColumn("last_updated").AsDateTime().Nullable();
        }

        public override void Down()
        {
            Delete.Table(investors_summary);
        }
    }
}
