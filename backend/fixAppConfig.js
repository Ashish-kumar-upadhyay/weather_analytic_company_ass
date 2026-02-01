const { sequelize } = require('./config/db');
const { QueryTypes } = require('sequelize');

async function fixAppConfigTable() {
  try {
    // Start a transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Drop the existing app_config table
      await sequelize.query('DROP TABLE IF EXISTS "app_config" CASCADE', { transaction });
      
      // Create the app_config table with the correct schema
      await sequelize.query(`
        CREATE TABLE "app_config" (
          "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "key" VARCHAR(255) NOT NULL UNIQUE,
          "value" VARCHAR(255) NOT NULL,
          "description" VARCHAR(255),
          "updated_by" UUID REFERENCES "users"("id") ON DELETE SET NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
        );
        
        COMMENT ON COLUMN "app_config"."key" IS 'Config key name';
        COMMENT ON COLUMN "app_config"."value" IS 'Config value (stored as string, parsed by app)';
        COMMENT ON COLUMN "app_config"."description" IS 'Human-readable description of this setting';
        COMMENT ON COLUMN "app_config"."updated_by" IS 'Admin user_id who last updated this setting';
      `, { transaction });
      
      // Commit the transaction
      await transaction.commit();
      console.log('✅ Successfully fixed app_config table');
      
      // Re-import the model to ensure it's using the correct schema
      const AppConfig = require('./models/AppConfig');
      
      // Sync the model to ensure indexes are created
      await AppConfig.sync();
      console.log('✅ Successfully synced AppConfig model');
      
      process.exit(0);
    } catch (error) {
      // If there's an error, rollback the transaction
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('❌ Error fixing app_config table:', error);
    process.exit(1);
  }
}

// Execute the function
fixAppConfigTable();
