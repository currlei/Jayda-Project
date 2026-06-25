from pathlib import Path
path = Path('index.html')
text = path.read_text(encoding='utf-8')
start = '<!-- ===================== SEVEN ITEMS (separate section) -->'
end = '<!-- ===================== CELEBRANT FACTS -->'
idx1 = text.index(start)
idx2 = text.index(end)
old = text[idx1:idx2]
new = '''<!-- ===================== SEVEN ITEMS (separate section) -->
<section class="section reveal" id="seven-items">
  <div class="section-head">
    <p class="section-eyebrow">Seven Wishes &amp; Treasures</p>
    <div class="section-head-row">
      <h2 class="section-title">Seven Symbolic Items</h2>
      <button class="item-toggle" id="itemToggleBtn" aria-expanded="false">Show items</button>
    </div>
    <div class="divider"></div>
  </div>
  <div class="item-card single-card">
    <p class="item-card-intro">A clear, single-card view of Jayda’s seven symbolic items so you can see them quickly without scrolling through multiple cards.</p>
    <ul class="item-list collapsed" id="itemList">
      <li>1. 7 Symbolic Gifts</li>
      <li>2. 7 Treasures</li>
      <li>3. 7 Candles &amp; Wish</li>
      <li>4. 7 Roses</li>
      <li>5. 7 Dogs (stuffed toy)</li>
      <li>6. 7 Dress</li>
      <li>7. 7 Sleepwear</li>
    </ul>
  </div>
</section>

'''
path.write_text(text.replace(old, new), encoding='utf-8')
print('done')
