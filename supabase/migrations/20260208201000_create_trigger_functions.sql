-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create audit log function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name, 
        operation, 
        user_id, 
        old_values, 
        new_values, 
        created_at
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(current_setting('app.current_user_id', true), 'anonymous'),
        row_to_json(OLD),
        row_to_json(NEW),
        CURRENT_TIMESTAMP
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';