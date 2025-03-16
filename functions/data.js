const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const supabaseUrl = 'https://lrgkfajewylxfeelumwg.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZ2tmYWpld3lseGZlZWx1bXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjI3MzQsImV4cCI6MjA1NzYzODczNH0.tXl5eDZ0rbYUh0RiNN3qIgwHtC2sgB3fNwyutuGX5A4';
  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Function ready' })
  };
};
