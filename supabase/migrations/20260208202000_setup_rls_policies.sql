-- Row Level Security Policies

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Teams table policies
CREATE POLICY "Team members can view team" ON teams
    FOR SELECT USING (
        id IN (
            SELECT team_id FROM team_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team owners can update team" ON teams
    FOR UPDATE USING (
        id IN (
            SELECT team_id FROM team_members 
            WHERE user_id = auth.uid() AND role = 'owner'
        )
    );

-- Products table policies
CREATE POLICY "Team members can view team products" ON products
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM team_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can manage products" ON products
    FOR ALL USING (
        team_id IN (
            SELECT team_id FROM team_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );