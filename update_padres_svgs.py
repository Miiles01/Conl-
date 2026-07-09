import os
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    filename = os.path.basename(filepath)
    new_content = content

    if filename == 'hero-left.svg':
        # 1. Far Left leaves
        # Original: <path d="M70 210C70 171.34 101.34 140 140 140V140V210C140 248.66 108.66 280 70 280V280V210Z" fill="#9DC423"/>
        # Change second leaf to #D4DE6E
        new_content = new_content.replace(
            '<path d="M70 210C70 171.34 101.34 140 140 140V140V210C140 248.66 108.66 280 70 280V280V210Z" fill="#9DC423"/>',
            '<path d="M70 210C70 171.34 101.34 140 140 140V140V210C140 248.66 108.66 280 70 280V280V210Z" fill="#D4DE6E"/>'
        )
        
        # 2. Hexagon: Swap #FCC160 background with #EFA624 hexagon
        new_content = new_content.replace(
            '<rect width="140" height="140" transform="translate(140 140)" fill="#FCC160"/>\n<path d="M209.5 153L259.296 181.75V239.25L209.5 268L159.704 239.25V181.75L209.5 153Z" fill="#EFA624"/>',
            '<rect width="140" height="140" transform="translate(140 140)" fill="#EFA624"/>\n<path d="M209.5 153L259.296 181.75V239.25L209.5 268L159.704 239.25V181.75L209.5 153Z" fill="#FCC160"/>'
        )
        
        # 3. Circles: change #62CAD1 to #33B8C2
        new_content = new_content.replace('fill="#62CAD1"', 'fill="#33B8C2"')
        
        # 4. Heart: Background to #5B6AAB, Heart to #33B8C2
        # It's at translate(140 280)
        new_content = new_content.replace(
            '<rect width="140" height="140" transform="translate(140 280)" fill="#F5B2B3"/>',
            '<rect width="140" height="140" transform="translate(140 280)" fill="#5B6AAB"/>'
        )
        new_content = new_content.replace(
            'fill="#EF7E81"',
            'fill="#33B8C2"'
        )

    elif filename == 'hero-right.svg':
        # 1. Leaves on stem: currently #9DC423, should be #5B6AAB
        new_content = new_content.replace(
            '<path d="M0 140.981C0 140.439 0.439318 140 0.981244 140H2C41.2122 140 73 171.788 73 211H70.0188C31.3485 211 0 179.652 0 140.981Z" fill="#9DC423"/>',
            '<path d="M0 140.981C0 140.439 0.439318 140 0.981244 140H2C41.2122 140 73 171.788 73 211H70.0188C31.3485 211 0 179.652 0 140.981Z" fill="#5B6AAB"/>'
        )
        new_content = new_content.replace(
            '<path d="M73 237.237C73 206.73 97.7303 182 128.237 182V182C128.658 182 129 182.342 129 182.763V183.763C129 214.27 104.27 239 73.7634 239V239C73.3418 239 73 238.658 73 238.237V237.237Z" fill="#9DC423"/>',
            '<path d="M73 237.237C73 206.73 97.7303 182 128.237 182V182C128.658 182 129 182.342 129 182.763V183.763C129 214.27 104.27 239 73.7634 239V239C73.3418 239 73 238.658 73 238.237V237.237Z" fill="#5B6AAB"/>'
        )
        new_content = new_content.replace(
            '<rect x="68" y="207" width="5" height="73" fill="#9DC423"/>',
            '<rect x="68" y="207" width="5" height="73" fill="#5B6AAB"/>'
        )
        
        # 2. Triangle: Background #9DC423, Triangle #D4DE6E
        new_content = new_content.replace(
            '<rect width="140" height="140" transform="matrix(1 0 0 -1 140 280)" fill="#EFA624"/>\n<path d="M255 210L140 140V280L255 210Z" fill="#FCC160"/>',
            '<rect width="140" height="140" transform="matrix(1 0 0 -1 140 280)" fill="#9DC423"/>\n<path d="M255 210L140 140V280L255 210Z" fill="#D4DE6E"/>'
        )
        
        # 3. Heart (translate 140 140) -> Red background puzzle piece? Image 2 bottom-right is red.
        # But this is a heart shape. Let's make it match the red block in Image 2.
        # Background #EF7E81, Heart #F5B2B3 (or we keep Heart #EF7E81 and Background #F5B2B3? The red block has dark red background and light pink shape).
        # Let's use Background #EF7E81, Heart #F5B2B3.
        new_content = new_content.replace(
            '<rect width="140" height="140" transform="matrix(1 0 0 -1 140 140)" fill="#F5B2B3"/>',
            '<rect width="140" height="140" transform="matrix(1 0 0 -1 140 140)" fill="#EF7E81"/>'
        )
        new_content = new_content.replace(
            'fill="#EF7E81"',
            'fill="#F5B2B3"'
        )

    # For mobile frames
    if 'Frame' in filename:
        # Frame 339: Hexagon. Background #EFA624, Hexagon #FCC160
        if '339' in filename:
            new_content = new_content.replace('fill="#FCC160"', 'fill="#EFA624"')
            new_content = new_content.replace('fill="#EFA624"', 'fill="#FCC160"', 1)
            # Wait, if we replace FCC160 with EFA624, then we have two EFA624s.
            # Let's do it safer:
            new_content = content.replace('fill="#FCC160"', 'fill="TEMP"')
            new_content = new_content.replace('fill="#EFA624"', 'fill="#FCC160"')
            new_content = new_content.replace('fill="TEMP"', 'fill="#EFA624"')
            
        # Frame 340: Heart. This might be the red one or the cyan one. Let's make it Cyan.
        if '340' in filename:
            new_content = new_content.replace('fill="#F5B2B3"', 'fill="#5B6AAB"')
            new_content = new_content.replace('fill="#EF7E81"', 'fill="#33B8C2"')
            
        # Frame 341: Circles.
        if '341' in filename:
            new_content = new_content.replace('fill="#62CAD1"', 'fill="#33B8C2"')
            
        # Frame 343: Flower Petals. Should be Amarillo #FCC160
        if '343' in filename:
            new_content = new_content.replace('fill="#9DC423"', 'fill="#FCC160"')
            
        # Frame 345: Triangle. Background #9DC423, Triangle #D4DE6E
        if '345' in filename:
            new_content = new_content.replace('fill="#EFA624"', 'fill="#9DC423"')
            new_content = new_content.replace('fill="#FCC160"', 'fill="#D4DE6E"')
            
        # Frame 347: Heart. Make it the Red one to match bottom-right!
        if '347' in filename:
            new_content = new_content.replace('fill="#F5B2B3"', 'fill="#EF7E81"')
            new_content = new_content.replace('fill="#EF7E81"', 'fill="#F5B2B3"', 1) # Wait, it was F5B2B3 and EF7E81!
            # safer:
            new_content = content.replace('fill="#F5B2B3"', 'fill="TEMP"')
            new_content = new_content.replace('fill="#EF7E81"', 'fill="#F5B2B3"')
            new_content = new_content.replace('fill="TEMP"', 'fill="#EF7E81"')

    with open(filepath, 'w') as f:
        f.write(new_content)

files = glob.glob('/Users/miileshorton/Desktop/Archivos_Landing_Local/jaselu-landing-padres/public/img/hero*.svg')
files += glob.glob('/Users/miileshorton/Desktop/Archivos_Landing_Local/jaselu-landing-padres/public/img/hero-mobile-decor/*.svg')

for f in files:
    process_file(f)
