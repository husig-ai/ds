// Comprehensive Probe Script for Drew Sharma Realty
// Run this to diagnose all issues with the form and site

import { supabase } from './supabase-client.js';
import { config } from './config.js';

export const probe = {
  // ============================================================
  // CONFIGURATION CHECKS
  // ============================================================

  async checkConfig() {
    console.log('🔍 CHECKING CONFIGURATION');
    console.log('━'.repeat(50));

    const checks = {
      'Agent Name': config.agentFullName,
      'Company': config.brandName,
      'Location': config.primaryLocation,
      'Years In Market': config.yearsInMarket,
      'Homes Closed': config.homesClosedCount,
      'Rating': config.clientRating,
    };

    Object.entries(checks).forEach(([key, value]) => {
      console.log(`✓ ${key}: ${value}`);
    });

    console.log('━'.repeat(50));
    return checks;
  },

  // ============================================================
  // SUPABASE CHECKS
  // ============================================================

  async checkSupabaseConnection() {
    console.log('\n🔍 CHECKING SUPABASE CONNECTION');
    console.log('━'.repeat(50));

    try {
      // Test 1: Simple select query
      console.log('Test 1: Basic connection...');
      const { data, error: selectError } = await supabase
        .from('listings')
        .select('count')
        .limit(1);

      if (selectError) {
        console.error('❌ Connection failed:', selectError.message);
        return false;
      }
      console.log('✓ Connection successful');

      // Test 2: Check Supabase credentials
      console.log('\nTest 2: Verifying credentials...');
      console.log('✓ SUPABASE_URL:', supabase.supabaseUrl);
      console.log('✓ ANON_KEY:', supabase.supabaseKey.substring(0, 20) + '...');

      return true;
    } catch (err) {
      console.error('❌ Supabase check failed:', err.message);
      return false;
    }
  },

  // ============================================================
  // DATABASE SCHEMA CHECKS
  // ============================================================

  async checkDatabaseSchema() {
    console.log('\n🔍 CHECKING DATABASE SCHEMA');
    console.log('━'.repeat(50));

    const tables = ['listings', 'testimonials', 'leads'];
    const results = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.error(`❌ ${table} table: ${error.message}`);
          results[table] = false;
        } else {
          console.log(`✓ ${table} table exists`);
          results[table] = true;
        }
      } catch (err) {
        console.error(`❌ ${table} error:`, err.message);
        results[table] = false;
      }
    }

    console.log('━'.repeat(50));
    return results;
  },

  // ============================================================
  // ROW LEVEL SECURITY CHECKS
  // ============================================================

  async checkRLS() {
    console.log('\n🔍 CHECKING ROW LEVEL SECURITY');
    console.log('━'.repeat(50));

    const results = {};

    // Test 1: Can we read listings?
    try {
      const { error } = await supabase
        .from('listings')
        .select('*')
        .limit(1);

      if (error) {
        console.error('❌ Cannot read listings:', error.message);
        results.readListings = false;
      } else {
        console.log('✓ Can read listings (public read policy working)');
        results.readListings = true;
      }
    } catch (err) {
      console.error('❌ Error reading listings:', err.message);
      results.readListings = false;
    }

    // Test 2: Can we read testimonials?
    try {
      const { error } = await supabase
        .from('testimonials')
        .select('*')
        .limit(1);

      if (error) {
        console.error('❌ Cannot read testimonials:', error.message);
        results.readTestimonials = false;
      } else {
        console.log('✓ Can read testimonials');
        results.readTestimonials = true;
      }
    } catch (err) {
      console.error('❌ Error reading testimonials:', err.message);
      results.readTestimonials = false;
    }

    // Test 3: Can we insert a lead? (Critical for form)
    try {
      console.log('\nTest: Attempting to insert test lead...');
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          full_name: 'Test Probe',
          email: 'probe@test.local',
          status: 'new',
          source: 'probe'
        }])
        .select();

      if (error) {
        console.error('❌ Cannot insert leads:', error.message);
        results.insertLeads = false;
      } else {
        console.log('✓ Can insert leads (form should work)');
        results.insertLeads = true;

        // Clean up test data
        if (data && data[0]) {
          await supabase.from('leads').delete().eq('id', data[0].id);
          console.log('  (cleaned up test data)');
        }
      }
    } catch (err) {
      console.error('❌ Error inserting lead:', err.message);
      results.insertLeads = false;
    }

    console.log('━'.repeat(50));
    return results;
  },

  // ============================================================
  // FORM SUBMISSION TEST (Direct Database)
  // ============================================================

  async testFormSubmission() {
    console.log('\n🔍 TESTING FORM SUBMISSION (Database)');
    console.log('━'.repeat(50));

    try {
      console.log('Attempting test form submission...');

      const testPayload = {
        full_name: 'Probe Test',
        email: 'probe@example.com',
        phone: '(555) 555-5555',
        budget_min: 400000,
        budget_max: 600000,
        timeline: '3_6_months',
        financing_status: 'pre_approved',
        preferred_areas: 'Frisco, TX',
        property_types: ['single_family'],
        bedrooms_needed: 3,
        bathrooms_needed: 2,
        must_haves: 'Test submission',
        additional_notes: 'This is a probe test',
      };

      console.log('Payload:', testPayload);

      const startTime = Date.now();
      const { data, error } = await supabase
        .from('leads')
        .insert([testPayload])
        .select();
      const duration = Date.now() - startTime;

      if (error) {
        console.error('❌ Form submission failed:', error.message);
        return { success: false, error: error.message, duration };
      }

      console.log(`✓ Form submission successful (${duration}ms)`);
      console.log('✓ Test lead created:', data[0].id);

      // Clean up
      if (data && data[0]) {
        await supabase.from('leads').delete().eq('id', data[0].id);
        console.log('✓ Cleaned up test data');
      }

      return { success: true, duration };
    } catch (err) {
      console.error('❌ Form test error:', err.message);
      return { success: false, error: err.message };
    }
  },

  // ============================================================
  // INTAKE FORM UI TEST
  // ============================================================

  async testIntakeForm() {
    console.log('\n🔍 TESTING INTAKE FORM UI');
    console.log('━'.repeat(50));

    try {
      const form = document.getElementById('intakeForm');
      if (!form) {
        console.error('❌ Intake form not found on page');
        return { success: false, error: 'Form not found' };
      }
      console.log('✓ Form element found');

      // Check form elements
      const requiredFields = [
        { name: 'full_name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'tel' },
        { name: 'budget_min', type: 'number' },
        { name: 'budget_max', type: 'number' },
      ];

      for (const field of requiredFields) {
        const input = form.querySelector(`[name="${field.name}"]`);
        if (!input) {
          console.error(`❌ Field missing: ${field.name}`);
          return { success: false, error: `Missing field: ${field.name}` };
        }
        console.log(`✓ Field found: ${field.name}`);
      }

      // Check steps
      const steps = form.querySelectorAll('.step-panel');
      console.log(`✓ Form has ${steps.length} steps`);

      // Check buttons
      const nextBtn = document.getElementById('nextBtn');
      const backBtn = document.getElementById('backBtn');
      if (!nextBtn || !backBtn) {
        console.error('❌ Navigation buttons missing');
        return { success: false, error: 'Buttons missing' };
      }
      console.log('✓ Navigation buttons found');

      // Fill form with test data
      console.log('\n🔄 Filling form with test data...');
      form.querySelector('[name="full_name"]').value = 'Probe Tester';
      form.querySelector('[name="email"]').value = 'probe@test.local';
      form.querySelector('[name="phone"]').value = '(555) 555-5555';
      form.querySelector('[name="budget_min"]').value = '400000';
      form.querySelector('[name="budget_max"]').value = '600000';
      console.log('✓ Test data entered');

      // Check if form is in initial state
      if (nextBtn.textContent !== 'Continue' && nextBtn.textContent !== 'Submit') {
        console.warn('⚠️  Form button is in unexpected state:', nextBtn.textContent);
      }

      console.log('━'.repeat(50));
      return {
        success: true,
        formElement: true,
        fieldsCount: requiredFields.length,
        stepsCount: steps.length,
        message: 'Form UI is ready - manually test by clicking "Start my search"'
      };
    } catch (err) {
      console.error('❌ Form UI test error:', err.message);
      return { success: false, error: err.message };
    }
  },

  // ============================================================
  // DATA CHECKS
  // ============================================================

  async checkData() {
    console.log('\n🔍 CHECKING DATA IN DATABASE');
    console.log('━'.repeat(50));

    try {
      const [listings, testimonials, leads] = await Promise.all([
        supabase.from('listings').select('count'),
        supabase.from('testimonials').select('count'),
        supabase.from('leads').select('count'),
      ]);

      console.log(`✓ Listings: ${listings.data?.length || 0} rows`);
      console.log(`✓ Testimonials: ${testimonials.data?.length || 0} rows`);
      console.log(`✓ Leads: ${leads.data?.length || 0} rows`);

      if (!listings.data?.length) {
        console.warn('⚠️  No listings found - run seed.sql to populate');
      }
      if (!testimonials.data?.length) {
        console.warn('⚠️  No testimonials found - run seed.sql to populate');
      }

      console.log('━'.repeat(50));
      return {
        listings: listings.data?.length || 0,
        testimonials: testimonials.data?.length || 0,
        leads: leads.data?.length || 0,
      };
    } catch (err) {
      console.error('❌ Data check failed:', err.message);
      return { error: err.message };
    }
  },

  // ============================================================
  // RUN ALL CHECKS
  // ============================================================

  async runAll() {
    console.clear();
    console.log('╔' + '═'.repeat(48) + '╗');
    console.log('║' + ' DREW SHARMA REALTY - SYSTEM PROBE '.padEnd(49) + '║');
    console.log('╚' + '═'.repeat(48) + '╝');

    const results = {
      config: await this.checkConfig(),
      supabase: await this.checkSupabaseConnection(),
      schema: await this.checkDatabaseSchema(),
      rls: await this.checkRLS(),
      data: await this.checkData(),
      intakeFormUI: await this.testIntakeForm(),
      formSubmission: await this.testFormSubmission(),
    };

    console.log('\n╔' + '═'.repeat(48) + '╗');
    console.log('║' + ' SUMMARY '.padEnd(49) + '║');
    console.log('╠' + '═'.repeat(48) + '╣');

    // Status check
    const allGood =
      results.supabase &&
      Object.values(results.schema).every(v => v) &&
      results.rls.insertLeads &&
      results.intakeFormUI.success &&
      results.formSubmission.success;

    if (allGood) {
      console.log('║' + ' ✓ ALL SYSTEMS OK - SITE IS READY '.padEnd(49) + '║');
    } else {
      console.log('║' + ' ⚠️  ISSUES FOUND - SEE ABOVE '.padEnd(49) + '║');
    }

    console.log('╚' + '═'.repeat(48) + '╝');

    return results;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.probe = probe;
  console.log('%c✓ Probe loaded. Run: window.probe.runAll()', 'color: green; font-weight: bold;');
}
