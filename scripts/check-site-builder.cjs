const { chromium } = require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true}); const page=await browser.newPage();
 await page.goto(process.argv[2] || 'http://localhost:3000',{waitUntil:'domcontentloaded'});
 const builder=page.locator('#crie-seu-site'); await builder.waitFor();
 await builder.getByLabel('Nome da marca',{exact:true}).fill('Marca de teste');
 await builder.getByLabel('Orientação').selectOption('invertido');
 await builder.getByRole('button',{name:'Oceano',exact:true}).click();
 await builder.getByLabel('Fonte').selectOption('editorial');
 await builder.getByRole('button',{name:'Celular',exact:true}).click();
 if(await builder.locator('.builder-preview').evaluate(el=>el.scrollWidth>el.clientWidth)) throw Error('Preview overflow');
 await builder.getByRole('button',{name:'Usar no briefing'}).click();
 await page.locator('#contato .brief-design').getByText('Referência visual incluída').waitFor();
 if(!(await page.locator('#contato .brief-design pre').textContent()).includes('Marca de teste')) throw Error('Brief missing design');
 await page.reload(); await builder.getByLabel('Nome da marca',{exact:true}).waitFor();
 await page.waitForFunction(()=>document.querySelector('#crie-seu-site input').value==='Marca de teste');
 const popupPromise=page.waitForEvent('popup'); await builder.getByRole('button',{name:'Salvar em PDF'}).click(); const popup=await popupPromise;
 await popup.waitForLoadState('domcontentloaded');
 if(!(await popup.locator('body').textContent()).includes('Marca de teste')) throw Error('PDF missing design');
 await popup.close();
 await page.setViewportSize({width:390,height:844});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw Error('Mobile overflow');

 console.log('PASS: live customization, briefing, persistence, PDF contents and mobile layout');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

