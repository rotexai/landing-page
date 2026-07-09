import React, { useEffect, useRef, useState } from 'react';
import '../css/index.css';

const features = [
  {
    title: 'Workflow builder',
    body: 'Describe the process in natural language. RotexAI generates the workflow structure, steps, conditions, and data flow.',
  },
  {
    title: 'Transparent logic',
    body: 'Open and review the logic behind each workflow instead of depending on hidden AI decisions.',
  },
  {
    title: 'Typed data contracts',
    body: 'Define clear inputs and outputs so errors can be detected before the workflow goes live.',
  },
  {
    title: 'Testing before launch',
    body: 'Run the workflow with sample data, inspect logs, and validate results before releasing it to your team.',
  },
  {
    title: 'Version history',
    body: 'Track changes, execution status, and workflow results so you always know what happened.',
  },
  {
    title: 'Custom web apps',
    body: 'Generate role-based interfaces for each process, so employees only see the forms, data, and actions they need.',
  },
];

const benefits = [
  {
    icon: '01',
    title: 'Minimize repeated work',
    body: 'Turn recurring business tasks into workflows that can be reviewed, tested, and reused.',
    metric: 'Fewer handoffs, fewer repeated steps.',
  },
  {
    icon: '02',
    title: 'Control AI costs',
    body: 'Use AI only when reasoning is truly needed, while stable steps run through approved logic.',
    metric: 'Use reasoning where it matters, not on every repeated action.',
  },
  {
    icon: '03',
    title: 'Stay in control',
    body: 'View, edit, test, and approve the workflow before your team starts using it.',
    metric: 'Review before release. Inspect logic before it runs.',
  },
  {
    icon: '04',
    title: 'Simple to use',
    body: 'Your team works inside a clean web app, not inside a complex workflow builder.',
    metric: 'A clear app for daily work.',
  },
];

const solutions = [
  ['Procurement approval', 'Create purchase requests, check budgets, route approvals, and track order status in one operational interface.'],
  ['Customer onboarding', 'Manage customer profiles, required documents, onboarding steps, and missing-information alerts.'],
  ['Recurring reports', 'Select reporting periods, monitor data collection progress, and download verified outputs.'],
  ['Internal operations', 'Transform repeated internal tasks into reusable workflows with clear logic, typed data, and controlled releases.'],
];

const comparisonRows = [
  {
    criteria: 'Process setup',
    agent: 'Write prompts for every run',
    workflow: 'Manually configure steps',
    rotexai: 'AI creates from description',
  },
  {
    criteria: 'Repeated work',
    agent: 'AI reasons again every time',
    workflow: 'Runs fixed workflows',
    rotexai: 'Runs approved logic',
  },
  {
    criteria: 'Inspectability',
    agent: 'Hard to inspect decisions',
    workflow: 'Flow is visible, context is limited',
    rotexai: 'Workflow, logic, and data are visible',
  },
  {
    criteria: 'Operating cost',
    agent: 'Can become expensive when repeated',
    workflow: 'Lower cost, but setup-heavy',
    rotexai: 'Uses AI only where reasoning matters',
  },
  {
    criteria: 'Team interface',
    agent: 'Mostly chat-based',
    workflow: 'Internal forms or workflow screens',
    rotexai: 'Dedicated web app for each process',
  },
];

const workflowNodes = [
  {
    className: 'node-input',
    icon: 'msg',
    label: 'Input',
    title: 'Describe process',
    body: 'Tell RotexAI what repeats.',
  },
  {
    className: 'node-ai',
    icon: 'ai',
    label: 'AI powered',
    title: 'AI maps workflow',
    body: 'Steps, rules, and data fields.',
  },
  {
    className: 'node-review',
    icon: 'check',
    label: 'Human control',
    title: 'Review logic',
    body: 'Inspect before launch.',
  },
  {
    className: 'node-run',
    icon: 'play',
    label: 'Logic execution',
    title: 'Run approved logic',
    body: 'Fast, predictable, auditable.',
  },
  {
    className: 'node-edit',
    icon: 'edit',
    label: 'Editable',
    title: 'Adjust workflow',
    body: 'Change rules anytime.',
  },
  {
    className: 'node-app',
    icon: 'app',
    label: 'Custom interface',
    title: 'Ship custom app',
    body: 'A focused app for your team.',
  },
];

const heroFragments = [
  { text: 'agent.run()', side: 'left', top: 14, x: -26, y: 96, kind: 'code' },
  { text: 'invoice_total = 12840', side: 'left', top: 26, x: -18, y: 62, kind: 'metric' },
  { text: 'if budget > limit', side: 'left', top: 40, x: -22, y: 28, kind: 'logic' },
  { text: 'approval.status = pending', side: 'left', top: 56, x: -15, y: -8, kind: 'code' },
  { text: 'task.queue[24]', side: 'left', top: 70, x: -28, y: -42, kind: 'metric' },
  { text: '{ "source": "invoice" }', side: 'left', top: 82, x: -14, y: -78, kind: 'json' },
  { text: 'sync.crm()', side: 'right', top: 16, x: 26, y: 92, kind: 'code' },
  { text: 'webhook: /approve', side: 'right', top: 30, x: 18, y: 56, kind: 'line' },
  { text: 'payroll.check()', side: 'right', top: 44, x: 24, y: 20, kind: 'code' },
  { text: 'risk.score = 0.18', side: 'right', top: 58, x: 16, y: -18, kind: 'metric' },
  { text: 'sla.timer.start()', side: 'right', top: 72, x: 28, y: -54, kind: 'code' },
  { text: '{ "route": "manager" }', side: 'right', top: 84, x: 14, y: -88, kind: 'json' },
  { text: 'node: request', side: 'left', top: 20, x: -8, y: 84, kind: 'node' },
  { text: 'budget.delta +12%', side: 'left', top: 64, x: -9, y: -26, kind: 'metric' },
  { text: 'agent.plan.steps', side: 'right', top: 24, x: 9, y: 72, kind: 'node' },
  { text: 'queue.flush()', side: 'right', top: 66, x: 10, y: -34, kind: 'line' },
];

const faqs = [
  ['When does RotexAI use AI?', 'RotexAI uses AI to understand requirements, create or update workflows, and handle steps that require reasoning. Stable and repeated actions can run through deterministic logic.'],
  ['Can I view and edit the workflow created by AI?', 'Yes. You can review the workflow diagram, logic, data types, test results, and version history before publishing.'],
  ['What happens when the business process changes?', 'Describe the change to RotexAI, review the difference, run tests, and publish a new approved version.'],
  ['Can a workflow call AI while running?', 'Yes. A workflow can use AI for steps that require understanding or judgment, while keeping the rest of the process fast and predictable.'],
  ['Who uses the generated web app?', 'Operational team members use the app for their daily work. Workflow builders and admins can still access the logic and configuration behind it.'],
  ['Can RotexAI be self-hosted?', 'Yes. RotexAI is designed to support deployment on infrastructure controlled by the business.'],
];

function BenefitPreview({ index }) {
  if (index === 0) {
    return (
      <span className="benefit-card-preview preview-merge" aria-hidden="true">
        <span className="mini-chip">invoice</span>
        <span className="mini-chip">budget</span>
        <span className="mini-chip">approval</span>
        <span className="mini-flow-line" />
        <span className="mini-node" />
        <span className="mini-node" />
      </span>
    );
  }

  if (index === 1) {
    return (
      <span className="benefit-card-preview preview-meter" aria-hidden="true">
        <span className="meter-ring"><strong>38%</strong></span>
        <span className="meter-row is-ai">AI reasoning</span>
        <span className="meter-row">Approved logic</span>
      </span>
    );
  }

  if (index === 2) {
    return (
      <span className="benefit-card-preview preview-review" aria-hidden="true">
        {['Draft', 'Test', 'Review', 'Approve'].map((item) => (
          <span className="review-step" key={item}>
            <i />
            {item}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="benefit-card-preview preview-app" aria-hidden="true">
      <span className="app-bar" />
      <span className="app-field" />
      <span className="app-field short" />
      <span className="app-action">Run</span>
    </span>
  );
}

function App() {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [heroPhase] = useState('approved');
  const [activeWorkflowStep] = useState(3);
  const [activeLayer, setActiveLayer] = useState(0);
  const [workflowAnimated, setWorkflowAnimated] = useState(false);
  const workflowRef = useRef(null);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.motion-reveal');

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.16,
    });

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const layers = Array.from(document.querySelectorAll('.layered-page .section-layer'));
    if (!layers.length) return undefined;

    if (!('IntersectionObserver' in window)) {
      setActiveLayer(0);
      return undefined;
    }

    const visibleLayers = new Set();
    let animationFrame = 0;

    const updateActiveLayer = () => {
      animationFrame = 0;
      const viewportCenter = window.innerHeight / 2;
      const candidates = (visibleLayers.size ? Array.from(visibleLayers) : layers)
        .map((layer) => ({
          index: Number(layer.dataset.layerIndex),
          distance: Math.abs(layer.getBoundingClientRect().top + layer.getBoundingClientRect().height / 2 - viewportCenter),
        }))
        .sort((a, b) => a.distance - b.distance);

      if (candidates[0]) {
        setActiveLayer((current) => (current === candidates[0].index ? current : candidates[0].index));
      }
    };

    const requestUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateActiveLayer);
      }
    };

    layers.forEach((layer, index) => {
      layer.dataset.layerIndex = String(index);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleLayers.add(entry.target);
        } else {
          visibleLayers.delete(entry.target);
        }
      });
      requestUpdate();
    }, {
      rootMargin: '-42% 0px -42% 0px',
      threshold: 0,
    });

    layers.forEach((layer) => observer.observe(layer));
    updateActiveLayer();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const workflow = workflowRef.current;
    if (!workflow) return undefined;

    const activateIfInView = () => {
      const rect = workflow.getBoundingClientRect();
      const entersFocusBand = rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.22;

      if (entersFocusBand) {
        setWorkflowAnimated(true);
        return true;
      }

      return false;
    };

    if (!('IntersectionObserver' in window)) {
      setWorkflowAnimated(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setWorkflowAnimated(true);
        observer.disconnect();
      }
    }, {
      rootMargin: '-24% 0px -24% 0px',
      threshold: 0.08,
    });

    observer.observe(workflow);
    activateIfInView();

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="rotex-page">
      <header className="rotex-nav">
        <a className="brand" href="#top">RotexAI</a>
        <nav aria-label="Primary navigation">
          <a href="#benefits">About us</a>
          <a href="#solutions">Solutions</a>
          <a href="#features">Features</a>
          <a href="#company">Company</a>
        </nav>
        <a className="nav-cta" href="mailto:contact@rotexai.com">Get started</a>
      </header>

      <section className="hero" id="top" data-phase={heroPhase}>
        <div className="hero-fragments" aria-hidden="true">
          {heroFragments.map((fragment, index) => (
            <span
              className={`hero-fragment is-${fragment.side} fragment-${fragment.kind}`}
              key={`${fragment.text}-${index}`}
              style={{
                '--fragment-top': `${fragment.top}%`,
                '--fragment-x': `${fragment.x}rem`,
                '--fragment-y': `${fragment.y}px`,
                '--fragment-delay': `${index * 70}ms`,
              }}
            >
              <i />
              <code>{fragment.text}</code>
            </span>
          ))}
        </div>
        <div className="hero-copy motion-reveal is-visible">
          <p className="eyebrow">AI-built workflows for repeatable operations</p>
          <h1 className="hero-title" aria-label="Ship repeatable operations with AI-built workflows">
            <span className="gradient-line" data-text="Ship repeatable">Ship repeatable</span>
            <span className="gradient-line" data-text="operations with AI-built">operations with AI-built</span>
            <span className="gradient-line" data-text="workflows">workflows</span>
          </h1>
          <p className="hero-lede">
            Describe your business process once. RotexAI turns it into a transparent workflow and a custom web app your team can actually use.
          </p>
          <div className="actions">
            <a className="primary-btn" href="mailto:contact@rotexai.com">Get started</a>
            <a className="secondary-btn" href="#features">Learn more</a>
          </div>
        </div>
        <div className="workflow-panel motion-reveal is-visible" aria-label="RotexAI workflow preview">
          <div className="panel-top">
            <span>Workflow draft</span>
            <strong><i aria-hidden="true" />{heroPhase === 'approved' ? 'Ready for review' : heroPhase === 'review' ? 'Organizing inputs' : 'Chaotic inputs'}</strong>
          </div>
          <div className="workflow-steps">
            {['Request', 'Budget check', 'Approval route', 'Web app'].map((step, index) => (
              <span className={`workflow-node ${activeWorkflowStep >= index ? 'is-lit' : ''}`} key={step}>{step}</span>
            ))}
          </div>
          <div className={`logic-box ${heroPhase === 'approved' ? 'is-approved' : ''}`}>
            <p>{heroPhase === 'approved' ? 'Approved logic' : heroPhase === 'review' ? 'Ready for review' : 'Awaiting structure'}</p>
            <code>if amount &gt; limit: route to manager</code>
          </div>
        </div>
      </section>

      <div className="layered-page">
      <section className={`section section-layer benefits-layer motion-reveal ${activeLayer === 0 ? 'is-active' : 'is-muted'}`} id="benefits">
        <div className="benefits-header">
          <div>
            <p className="eyebrow">Key benefits</p>
            <h2 className="section-title typo-blur" data-text="Less repeated work. More operational control.">Less repeated work. More operational control.</h2>
          </div>
          <p>
            RotexAI turns recurring business tasks into workflows your team can review,
            control, and run with confidence.
          </p>
        </div>

        <div className="benefit-switcher">
          <div className="benefits-grid" aria-label="Key benefits">
            {benefits.map((benefit, index) => (
              <button
                className={`benefit-tab ${activeBenefit === index ? 'is-active' : ''}`}
                type="button"
                aria-pressed={activeBenefit === index}
                key={benefit.title}
                onClick={() => setActiveBenefit(index)}
                style={{ '--stagger': index }}
              >
                <BenefitPreview index={index} />
                <span className="benefit-icon" aria-hidden="true">{benefit.icon}</span>
                <span className="benefit-title">{benefit.title}</span>
                <span className="benefit-preview">{benefit.metric}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`section section-layer features-layer motion-reveal ${activeLayer === 1 ? 'is-active' : 'is-muted'}`} id="features">
        <div className="section-heading">
          <p className="eyebrow">Features loved by everyone</p>
          <h2 className="section-title typo-blur" data-text="AI builds. Workflow operates.">AI builds. Workflow operates.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title} style={{ '--stagger': index }}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`workflow-roadmap section-layer process-layer motion-reveal ${activeLayer === 2 ? 'is-active' : 'is-muted'} ${workflowAnimated ? 'is-animated' : ''}`}
        ref={workflowRef}
      >
        <div className="how-section-inner">
          <div className="how-copy">
            <p className="eyebrow">How it works</p>
            <h2 className="section-title typo-blur" data-text="Use AI for design, approved logic for repeated execution.">Use AI for design, approved logic for repeated execution.</h2>
            <p>
              Describe a process once. RotexAI turns it into a workflow your team
              can review, approve, and run through a focused app.
            </p>
          </div>

          <div className="workflow-visual" aria-label="RotexAI workflow diagram">
            <svg className="workflow-lines" viewBox="0 0 660 690" aria-hidden="true">
              <path pathLength="1" className="workflow-line line-1" d="M330 134 V158" />
              <path pathLength="1" className="workflow-line line-2" d="M330 256 V278" />
              <path pathLength="1" className="workflow-line line-3 line-approved" d="M330 376 C330 412 176 390 176 432" />
              <path pathLength="1" className="workflow-line line-4 line-edit" d="M330 376 C330 412 484 390 484 432" />
              <path pathLength="1" className="workflow-line line-5 line-approved" d="M176 556 C176 590 330 548 330 574" />
              <path pathLength="1" className="workflow-line line-6 line-edit" d="M484 556 C484 590 330 548 330 574" />
            </svg>

            {workflowNodes.map((node, index) => (
              <article className={`flow-node ${node.className} node-step-${index + 1}`} key={node.title}>
                <span className={`flow-node-icon icon-${node.icon}`} aria-hidden="true" />
                <div>
                  <span>{node.label}</span>
                  <h3>{node.title}</h3>
                  <p>{node.body}</p>
                </div>
              </article>
            ))}

            <span className="branch-label label-approved">Approved</span>
            <span className="branch-label label-edit">Needs edit</span>
          </div>
        </div>
      </section>

      <section className={`section section-layer solutions-layer motion-reveal ${activeLayer === 3 ? 'is-active' : 'is-muted'}`} id="solutions">
        <div className="section-heading">
          <p className="eyebrow">Solutions</p>
          <h2 className="section-title typo-blur" data-text="Start with one real process.">Start with one real process.</h2>
        </div>
        <div className="solution-grid">
          {solutions.map(([title, body], index) => (
            <article className="solution-card" key={title} style={{ '--stagger': index }}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`comparison section-layer why-layer motion-reveal ${activeLayer === 4 ? 'is-active' : 'is-muted'}`} id="company">
        <div className="why-inner">
          <div className="why-header">
            <p className="eyebrow">Why RotexAI</p>
            <h2 className="section-title typo-blur" data-text="Not just an AI agent. Not just a workflow tool.">Not just an AI agent. Not just a workflow tool.</h2>
            <p>RotexAI combines the speed of AI, the reliability of automation, and the usability of business software.</p>
          </div>

          <div className="comparison-table-wrap" aria-label="RotexAI comparison table">
            <div className="comparison-table">
              <div className="comparison-row comparison-head">
                <div>Criteria</div>
                <div>Dynamic AI agent</div>
                <div>Workflow tools</div>
                <div className="rotexai-cell">RotexAI</div>
              </div>

              {comparisonRows.map((row) => (
                <div className="comparison-row" key={row.criteria}>
                  <div>{row.criteria}</div>
                  <div>{row.agent}</div>
                  <div>{row.workflow}</div>
                  <div className="rotexai-cell">{row.rotexai}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`section section-layer faq-layer faq motion-reveal ${activeLayer === 5 ? 'is-active' : 'is-muted'}`}>
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title typo-blur" data-text="Still have questions?">Still have questions?</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={`faq-item ${openFaq === index ? 'is-open' : ''}`} key={question}>
              <button
                type="button"
                aria-expanded={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <span>{question}</span>
                <i aria-hidden="true" />
              </button>
              <div className="faq-answer">
                <p>{answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`contact-band section-layer cta-layer motion-reveal ${activeLayer === 6 ? 'is-active' : 'is-muted'}`}>
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="section-title cta-title cta-line-title">
            <span className="blur-line sharp" data-text="What work is">What work is</span>
            <span className="blur-line soft" data-text="being repeated">being repeated</span>
            <span className="blur-line medium" data-text="inside your">inside your</span>
            <span className="blur-line strong" data-text="company?">company?</span>
          </h2>
          <p>Describe it to RotexAI. See how AI turns it into a testable workflow, then launch a custom web app for your team.</p>
        </div>
        <form className="contact-form-card" action="mailto:contact@rotexai.com" method="post">
          <div className="form-card-copy">
            <h3>Turn repeated work into a workflow</h3>
            <p>Describe one recurring process. RotexAI will map the steps, logic, and app your team can use.</p>
          </div>

          <label>
            <span>Work email</span>
            <input type="email" name="email" placeholder="you@company.com" required />
          </label>

          <label>
            <span>Company name</span>
            <input type="text" name="company" placeholder="Your company" />
          </label>

          <label>
            <span>Team / department</span>
            <select name="department" defaultValue="">
              <option value="" disabled>Select team</option>
              <option>Operations</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Sales</option>
              <option>Customer Support</option>
              <option>Procurement</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            <span>Repeat frequency</span>
            <select name="frequency" defaultValue="">
              <option value="" disabled>Select frequency</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Many times per day</option>
              <option>Ad hoc</option>
            </select>
          </label>

          <label className="form-field-wide">
            <span>Repeated process</span>
            <textarea
              name="process"
              rows="4"
              placeholder="Example: Every Monday, we collect purchase requests, check budgets, and send approvals to managers."
            />
          </label>

          <button type="submit">Build my workflow →</button>
        </form>
      </section>
      </div>

      <footer className="rotex-footer">
        <div>
          <h2>RotexAI</h2>
          <p>Turning repeated work into transparent workflows and custom web apps for modern teams.</p>
          <a href="mailto:contact@rotexai.com">contact@rotexai.com</a>
        </div>
        <div>
          <h3>Company</h3>
          <a href="#benefits">About us</a>
          <a href="#company">Customers</a>
          <a href="#top">Privacy policy</a>
          <a href="#top">Terms of use</a>
        </div>
        <div>
          <h3>Product</h3>
          <a href="#features">How it works</a>
          <a href="#features">Transparent logic</a>
          <a href="#solutions">Custom apps</a>
          <a href="#company">Comparison</a>
        </div>
        <div>
          <h3>Resources</h3>
          <a href="#solutions">Use cases</a>
          <a href="#top">Integrations</a>
          <a href="#top">Blogs</a>
          <a href="mailto:contact@rotexai.com">Contact</a>
        </div>
        <small>© 2026 RotexAI. All rights reserved.</small>
      </footer>
    </main>
  );
}

export default App;
